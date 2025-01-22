# movies/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MovieConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Adiciona o cliente ao grupo 'movies'
        await self.channel_layer.group_add(
            'movies',
            self.channel_name
        )
        await self.accept()
        print("WebSocket connected and added to 'movies' group")


    async def disconnect(self, close_code):
        # Remove o cliente do grupo 'movies'
        await self.channel_layer.group_discard(
            'movies',
            self.channel_name
        )
        print("WebSocket disconnected and removed from 'movies' group")


    # Método para enviar atualizações para o WebSocket
    async def send_update(self, event):
        print(f"Sending update to WebSocket: {event['data']}")
        await self.send(text_data=json.dumps(event['data']))
