import os
import requests
import json
import re
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), '.env'))

class SynthesisAgent:
    def __init__(self):
        load_dotenv(os.path.join(os.getcwd(), '.env'))
        self.hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
        self.ollama_host = os.getenv("OLLAMA_HOST")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "mistral")
        
        # Cloud client - Llama-3-8B is elite for multilingual instructions
        self.client = InferenceClient(
            model="meta-llama/Meta-Llama-3-8B-Instruct", 
            token=self.hf_token
        )

    def _call_ollama(self, system_prompt, user_prompt):
        if not self.ollama_host:
            return None
            
        print(f"🤖 CALLING LOCAL OLLAMA ({self.ollama_model})...")
        try:
            url = f"{self.ollama_host}/api/chat"
            payload = {
                "model": self.ollama_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=120)
            if response.status_code == 200:
                result = response.json()
                return result.get('message', {}).get('content')
        except Exception as e:
            print(f"Ollama connection failed: {e}")
        return None

    def generate_master_briefing(self, topic, articles, language='english', role='investor'):
        context = "\n\n".join([f"Article: {a['title']}\nContent: {a['content']}" for a in articles])
        language_instruction = f"The synthesis MUST be written in {language}. You MUST output ONLY the JSON object."
        
        # Role-based customization
        role_prompts = {
            "investor": "Focus on portfolio-relevant stories, market impacts, and ROI insights.",
            "founder": "Focus on funding news, competitor moves, and startup strategy.",
            "student": "Focus on explainer-first content, defining complex terms simply.",
            "analyst": "Focus on raw data, regulatory shifts, and deep macro-economic trends."
        }
        role_instruction = role_prompts.get(role.lower(), role_prompts["investor"])

        system_prompt = (
            f"You are an elite business intelligence engine specifically tailored for a {role.upper()}. "
            "You extract deep insights from news articles. "
            "You MUST return a VALID JSON object. Do NOT include any text outside the JSON."
        )
        user_prompt = (
            f"Synthesize the latest news about '{topic}' into a high-level briefing.\n"
            f"CRITICAL LANGUAGE RULE: Every VALUE in the resulting JSON object MUST be written in {language.upper()}.\n"
            f"PERSONALIZATION RULE: {role_instruction}\n\n"
            f"Context:\n{context}\n\n"
            f"STRICT OUTPUT FORMAT (Values must be in {language.upper()}):\n"
            f"{{\n"
            f"  \"summary\": \"Briefing in {language}\",\n"
            f"  \"key_players\": [\"Companies in {language}\"],\n"
            f"  \"sentiment\": \"Sentiment word in {language}\",\n"
            f"  \"contrarian_view\": \"Alternative view in {language}\",\n"
            f"  \"next_steps\": \"Strategic advice in {language}\"\n"
            f"}}\n\n"
            f"RULE: Do NOT translate the JSON keys. ONLY translate the values. Output ONLY the JSON object."
        )
        
        # Logic: If language is NOT English, go straight to Cloud for better multilingual quality and speed.
        # Local models often struggle with non-Latin scripts and complex multilingual instructions.
        if language.lower() == "english":
            # 1. Try Ollama (Local)
            local_text = self._call_ollama(system_prompt, user_prompt)
            if local_text:
                parsed = self._parse_json(local_text)
                if parsed and parsed.get('summary') != "No summary generated":
                    return parsed
        else:
            print(f"🌍 NON-ENGLISH REQUEST ({language.upper()}) DETECTED. ROUTING TO CLOUD FOR ACCURACY...")

        # 2. Try Hugging Face (Cloud)
        print(f"☁️ FALLING BACK TO CLOUD AI (mistralai/Mistral-7B-Instruct-v0.3)...")
        try:
            response = self.client.chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1024,
                temperature=0.1
            )
            text = response.choices[0].message.content
            return self._parse_json(text)
        except Exception as e:
            return {
                "summary": f"Error calling AI: {str(e)}",
                "key_players": [],
                "sentiment": "Error",
                "next_steps": "Check Ollama or API logs"
            }

    def _parse_json(self, text):
        if not text:
            return self._get_fallback("No content received")
            
        try:
            # 1. Clean up markdown code blocks if present
            clean_text = re.sub(r'```json\s*(.*?)\s*```', r'\1', text, flags=re.DOTALL)
            clean_text = re.sub(r'```\s*(.*?)\s*```', r'\1', clean_text, flags=re.DOTALL)
            
            # 2. Find the first '{' and the last '}'
            start = clean_text.find('{')
            end = clean_text.rfind('}')
            
            if start != -1 and end != -1:
                json_str = clean_text[start:end+1]
                data = json.loads(json_str)
                
                # Bulletproof: All fields MUST be strings or simple lists
                for key in data:
                    if isinstance(data[key], dict):
                        # Flatten to string
                        data[key] = " | ".join([f"{k.upper()}: {v}" for k, v in data[key].items() if v])
                    elif isinstance(data[key], list):
                        # Ensure all items in list are strings
                        data[key] = ", ".join([str(i) for i in data[key]])
                    elif not isinstance(data[key], str):
                        data[key] = str(data[key])

                return data
        except Exception:
            pass
        
        # If parsing failed, try to return a clean fallback
        return self._get_fallback(text)

    def _get_fallback(self, text):
        # If it looks like JSON but failed to parse, at least clean it for display
        clean_summary = text.split('"summary":')[-1].split('",')[0].replace('"', '').strip() if '"summary":' in text else text.strip()
        
        return {
            "summary": clean_summary if clean_summary else "No summary generated",
            "key_players": [],
            "sentiment": "Analysis Pending",
            "next_steps": "Manual review required"
        }
