# movies/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Movie, Rating

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
            'ratings': list(instance.ratings.values('id', 'movie', 'rating'))
        }
    }
    print(f"Sending to WebSocket: {data}")
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
    print(f"Sending to WebSocket: {data}")
    async_to_sync(channel_layer.group_send)(
        'movies',
        {
            'type': 'send_update',
            'data': data
        }
    )

@receiver(post_save, sender=Rating)
def rating_saved(sender, instance, created, **kwargs):
    movie = instance.movie
    if not getattr(movie, '_from_rating', False):
        print(f"Rating saved: {instance}. Updating Movie: {movie}")
        # Marca que a operação está vindo deste sinal para evitar recursão
        movie._from_rating = True
        movie.save()
        del movie._from_rating

@receiver(post_delete, sender=Rating)
def rating_deleted(sender, instance, **kwargs):
    movie = instance.movie
    if not getattr(movie, '_from_rating', False):
        print(f"Rating deleted: {instance}. Updating Movie: {movie}")
        # Marca que a operação está vindo deste sinal para evitar recursão
        movie._from_rating = True
        movie.save()
        del movie._from_rating
