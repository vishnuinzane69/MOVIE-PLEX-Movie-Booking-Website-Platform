from movie.models import  Movie_auth
from movieapi.models import book,Event
from rest_framework import serializers
from django.core.validators import validate_email


class MovieAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_auth
        fields = ['id', 'email', 'password']


class bookSerializer(serializers.ModelSerializer):
    class Meta:
        model = book
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = '__all__'  # Include all fields of the Event model
