import os
import requests
import json
import re
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), '.env'))

class TimelineAgent:
    def __init__(self):
        load_dotenv(os.path.join(os.getcwd(), '.env'))
        self.hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
        self.ollama_host = os.getenv("OLLAMA_HOST")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "mistral")
        
        self.client = InferenceClient(
            model="mistralai/Mistral-7B-Instruct-v0.3", 
            token=self.hf_token
        )

    def _call_ollama(self, system_prompt, user_prompt):
        if not self.ollama_host:
            return None
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
                return response.json().get('message', {}).get('content')
        except Exception:
            pass
        return None

    def extract_timeline(self, articles):
        context = "\n\n".join([f"Article: {a['title']}\nContent: {a['content']}" for a in articles])
        
        system_prompt = "You are a senior data extraction agent. You convert news into chronological data points."
        user_prompt = (
            f"Extract a detailed chronological timeline of developments regarding the news in the context below. "
            f"Context:\n{context}\n\n"
            f"STRICT OUTPUT FORMAT:\n"
            f"{{\n"
            f"  \"events\": [\n"
            f"    {{\"date\": \"YYYY-MM-DD\", \"description\": \"Concise milestone summary\"}}\n"
            f"  ]\n"
            f"}}\n\n"
            f"STRICT RULE: Ensure dates are in YYYY-MM-DD format. Only return the JSON."
        )
        
        # 1. Try Ollama (Local)
        local_text = self._call_ollama(system_prompt, user_prompt)
        text = local_text
        
        # 2. Try Hugging Face (Cloud)
        if not text:
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
            except Exception:
                return []
        
        try:
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                return parsed.get('events', [])
            return []
        except Exception:
            return []
