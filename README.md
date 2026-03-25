# ET Pulse: AI-Native Business Intelligence Navigator 🚀📈🤖

**ET Pulse** is a cutting-edge business intelligence platform built for 2026. It transforms static business news into an interactive, multi-dimensional, and personalized intelligence experience.

## ✨ Core Features

### 🔍 1. News Navigator (Intelligence Briefings)
Instead of reading separate articles, **ET Pulse** synthesizes global news into a single, comprehensive deep briefing. Powered by **Mistral** and **Phi-3**, it provides executive summaries, strategic entities, and market sentiment in seconds.

### 🎬 2. AI News Video Studio
Automatically transform any business headline into a **broadcast-quality short video** (9:16 vertical). Featuring AI-generated narration, animated data visuals, and glassmorphic overlays—optimized for modern mobile consumption.

### 📉 3. Pulse Timeline (Story Arc Tracker)
A complete visual narrative of ongoing stories. Track developments chronologically with an interactive, animated timeline, mapped key players, and sentiment shift tracking.

### 🌍 4. Vernacular Intelligence Engine
Real-time, context-aware translation of business news into **Hindi, Tamil, and Telugu**, adapting the explanation to local cultural contexts rather than literal translation.

### 🛡️ 5. Zero-Latency Hybrid AI
Prioritizes **local Ollama inference** (Mistral/Phi-3) for maximum speed and privacy, with seamless cloud failover to Hugging Face for 100% uptime.

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
