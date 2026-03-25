from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField()
    url = models.URLField(unique=True)
    published_date = models.DateTimeField()
    sentiment = models.CharField(max_length=50, null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    vector_embedding = models.JSONField(null=True, blank=True)  # Store embeddings as JSON if pgvector is not available locally
    
    def __str__(self):
        return self.title

class Event(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='events')
    date = models.DateField()
    description = models.TextField()
    sentiment_shift = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['date']
