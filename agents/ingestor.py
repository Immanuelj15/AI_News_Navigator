import os
import requests
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from news.models import Article

class IngestorAgent:
    def __init__(self):
        self.api_key = os.getenv("NEWS_API_KEY")
        self.endpoint = "https://newsapi.org/v2/everything"

    def fetch_et_articles(self, topic):
        if not self.api_key:
            print("WARNING: NEWS_API_KEY not found. Falling back to mock data.")
            return self._mock_fetch(topic)

        print(f"📡 FETCHING REAL-TIME NEWS: {topic}")
        
        params = {
            'q': topic,
            'apiKey': self.api_key,
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': 5
        }

        try:
            response = requests.get(self.endpoint, params=params)
            data = response.json()
            
            if data.get("status") != "ok":
                print(f"Error from NewsAPI: {data.get('message')}")
                return self._mock_fetch(topic)

            articles = data.get("articles", [])
            real_articles = []

            for art in articles:
                published_str = art.get('publishedAt')
                published_dt = parse_datetime(published_str) if published_str else timezone.now()
                
                # Save to DB for persistence
                obj, created = Article.objects.get_or_create(
                    url=art['url'],
                    defaults={
                        'title': art['title'],
                        'content': art['description'] or art['content'] or "No content available.",
                        'published_date': published_dt
                    }
                )
                real_articles.append({
                    'title': art['title'],
                    'content': art['description'] or art['content'],
                    'url': art['url'],
                    'published_date': published_dt
                })
            
            return real_articles
        except Exception as e:
            print(f"Failed to fetch live news: {e}")
            return self._mock_fetch(topic)

    def _mock_fetch(self, topic):
        mock_articles = [
            {
                'title': f'{topic} - Market Analysis 2026',
                'content': f'Simulated data for {topic} regarding growth and regulation.',
                'url': f'https://example.com/mock/{topic}/1',
                'published_date': timezone.now()
            }
        ]
        return mock_articles
