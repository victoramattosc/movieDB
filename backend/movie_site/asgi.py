# asgi.py

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import movies.routing  # Importar o roteamento das apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_site.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            movies.routing.websocket_urlpatterns  # Incluir as rotas de WebSocket das apps
        )
    ),
})
