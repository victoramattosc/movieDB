from rest_framework import serializers
from .models import Movie, Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'movie', 'rating']

class MovieSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)  # Define como somente leitura

    class Meta:
        model = Movie
        fields = ['id', 'name', 'description', 'duration', 'image', 'ratings', 'average_rating']
