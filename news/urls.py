from django.urls import path
from .views import BriefingView, TimelineView, GenerateVideoView, MediaProxyView

urlpatterns = [
    path('brief/', BriefingView.as_view(), name='briefing'),
    path('timeline/', TimelineView.as_view(), name='timeline'),
    path('generate-video/', GenerateVideoView.as_view(), name='generate-video'),
    path('media/<path:path>', MediaProxyView.as_view(), name='media-proxy'),
]
