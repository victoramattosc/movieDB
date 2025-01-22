# movies/models.py

from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.serializers import serialize
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Movie(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.PositiveIntegerField()  # Em minutos
    image = models.URLField()  # URL para a imagem
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def average_rating(self):
        return self.ratings.aggregate(average=models.Avg('rating'))['average'] or 0

    def __str__(self):
        return self.name

class Rating(models.Model):
    movie = models.ForeignKey(Movie, related_name='ratings', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # Nota de 1 a 5

    def __str__(self):
        return f"{self.movie.name} - {self.rating}"

# Sinais para notificar via WebSocket
@receiver(post_save, sender=Movie)
def movie_saved(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        'action': 'create' if created else 'update',
        'movie': {
            'id': instance.id,
            'name': instance.name,
            'description': instance.description,
            'duration': instance.duration,
            'image': instance.image,
            'average_rating': instance.average_rating,
        }
    }
    async_to_sync(channel_layer.group_send)(
        'movies',
        {
            'type': 'send_update',
            'data': data
        }
    )

@receiver(post_delete, sender=Movie)
def movie_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        'action': 'delete',
        'movie_id': instance.id
    }
    async_to_sync(channel_layer.group_send)(
        'movies',
        {
            'type': 'send_update',
            'data': data
        }
    )
