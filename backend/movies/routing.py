# movies/routing.py

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/movies/', consumers.MovieConsumer.as_asgi()),
]
