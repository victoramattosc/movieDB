from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet

# Configurando o router para as views
router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('', include(router.urls)),
]
