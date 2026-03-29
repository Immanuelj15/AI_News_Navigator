# ET Pulse: AI-Native Business Intelligence Navigator 🚀📈🤖

**ET Pulse** is a cutting-edge business intelligence platform built for 2026. It transforms static business news into an interactive, multi-dimensional, and personalized intelligence experience.

## ✨ Core Features

### 🔍 1. News Navigator (Intelligence Briefings)
Instead of reading separate articles, **ET Pulse** synthesizes global news into a single, comprehensive deep briefing. Powered by **Meta-Llama-3** and **Mistral**, it provides executive summaries, strategic entities, and market sentiment in seconds.

### 👤 2. My ET — Personalized AI Newsroom
A fundamentally different news experience for every user. Select your persona (**Mutual Fund Investor, Startup Founder, Student, or Market Analyst**) to trigger tailored synthesis, role-specific insights, and relevant "What to watch next" predictions.

### 🎬 3. AI News Video Studio
Automatically transform any business headline into a **broadcast-quality short video** (9:16 vertical). Featuring AI-generated narration, animated data visuals, and premium glassmorphic overlays—optimized for high-impact mobile consumption.

### 📉 4. Pulse Timeline (Story Arc Tracker)
A complete visual narrative of ongoing stories. Track developments chronologically with an interactive vertical timeline, mapped strategic entities, sentiment shift tracking, and **Contrarian Market Perspectives**.

### 🌍 5. Vernacular Intelligence Engine
Real-time, context-aware translation of business news into **Hindi, Tamil, and Telugu**. Uses high-precision **Cloud Routing** to ensure culturally adapted explanations and local business context, not just literal translation.

### 🛡️ 6. Zero-Latency Hybrid AI Architecture
Prioritizes **local Ollama inference** (Mistral/Phi-3) for maximum privacy and speed, with intelligent **Cloud Failover** to Llama-3-8B on Hugging Face for superior multilingual accuracy and 100% availability.

## 🛠️ Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion
- **AI Engine**: Ollama (Local), Hugging Face Inference API (Cloud)
- **Video Engine**: MoviePy, gTTS
- **Data Source**: NewsAPI.org

## 🚀 Quick Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama (running locally)

### 2. Backend Setup
```bash
git clone https://github.com/Immanuelj15/AI_News_Navigator.git
cd AI_News_Navigator
python -m venv venv
source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
HUGGINGFACE_API_TOKEN=your_token
NEWS_API_KEY=your_key
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral:latest
```

---
Built with ❤️ for **The Economic Times Hackathon 2026**
