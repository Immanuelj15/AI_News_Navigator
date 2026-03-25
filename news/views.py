import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from news.models import Article, Event
from agents.ingestor import IngestorAgent
from agents.synthesis import SynthesisAgent
from agents.timeline import TimelineAgent
from agents.video_studio import VideoStudio
from django.http import HttpResponse, FileResponse
import mimetypes

class HomeView(APIView):
    def get(self, request):
        return HttpResponse("<h1>ET Pulse AI-Native News Intelligence Backend</h1><p>The API is running. Please use the <a href='http://localhost:5173'>Frontend Dashboard</a> to interact with the system.</p>")

class BriefingView(APIView):
    def get(self, request):
        try:
            topic = request.query_params.get('query')
            lang = request.query_params.get('lang', 'english')
            role = request.query_params.get('role', 'investor')
            if not topic:
                return Response({"error": "Query parameter 'query' is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # 1. Ingest
            ingestor = IngestorAgent()
            ingestor.fetch_et_articles(topic)
            
            # 2. Retrieve and convert to dicts
            articles = Article.objects.filter(title__icontains=topic)[:5]
            article_dicts = [
                {"title": a.title, "content": a.content} for a in articles
            ]
            
            # 3. Synthesize
            synthesis = SynthesisAgent()
            briefing = synthesis.generate_master_briefing(topic, article_dicts, language=lang, role=role)
            
            return Response(briefing)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TimelineView(APIView):
    def get(self, request):
        try:
            topic = request.query_params.get('topic')
            if not topic:
                return Response({"error": "Query parameter 'topic' is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            articles = Article.objects.filter(title__icontains=topic)[:5]
            article_dicts = [
                {"title": a.title, "content": a.content} for a in articles
            ]
            
            timeline_agent = TimelineAgent()
            events = timeline_agent.extract_timeline(article_dicts)
            
            return Response({"events": events})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateVideoView(APIView):
    def post(self, request):
        topic = request.data.get('topic')
        summary = request.data.get('summary')
        
        if not topic or not summary:
            return Response({"error": "Topic and summary are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        studio = VideoStudio()
        try:
            output_path = studio.generate_short(summary, topic)
            
            # Convert OS path to URL (ensure forward slashes and /media/ prefix)
            # studio.output_dir is typically 'media/videos'
            # output_path is 'media/videos/topic_briefing.mp4'
            
            relative_path = os.path.relpath(output_path, settings.BASE_DIR)
            # In case it's already relative to BASE_DIR or just 'media/...'
            if not relative_path.startswith('media'):
                 relative_path = os.path.join('media', 'videos', os.path.basename(output_path))
            
            video_url = "/api" + "/" + relative_path.replace("\\", "/")
            
            return Response({"video_url": video_url})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MediaProxyView(APIView):
    def get(self, request, path):
        # path is like 'videos/Topic_briefing.mp4'
        full_path = os.path.join(settings.MEDIA_ROOT, path)
        if not os.path.exists(full_path):
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        content_type, _ = mimetypes.guess_type(full_path)
        response = FileResponse(open(full_path, 'rb'), content_type=content_type or 'video/mp4')
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Range, Content-Type"
        response["Content-Disposition"] = "inline"
        return response
