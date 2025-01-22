from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Movie, Rating
from .serializers import MovieSerializer, RatingSerializer

class MovieViewSet(ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    @action(detail=True, methods=['POST'])
    def add_rating(self, request, pk=None):
        try:
            movie = self.get_object()
            rating_value = request.data.get('rating')

            if rating_value is None:
                return Response({"error": "Rating is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                rating_value = int(rating_value)
            except ValueError:
                return Response({"error": "Rating must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

            # Valida a nota
            if not (1 <= rating_value <= 5):
                return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

            # Cria uma nova avaliação
            Rating.objects.create(movie=movie, rating=rating_value)

            # Recalcula a média de avaliações
            average_rating = movie.average_rating

            # Retorna o filme atualizado com as novas avaliações
            serializer = self.get_serializer(movie)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
