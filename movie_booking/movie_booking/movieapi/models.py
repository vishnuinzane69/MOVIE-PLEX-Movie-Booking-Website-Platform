import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=500)
    genre = models.CharField(max_length=100)
    description = models.TextField()
    poster = models.ImageField(upload_to='media', null=True)
    release_date = models.DateField()
    enabled = models.BooleanField(default=True)
    movie_status = models.CharField(max_length=20, default="active")  # Default value is "active"

    def __str__(self):
        return self.title

class book(models.Model):
    movie=models.ForeignKey('Event',on_delete=models.CASCADE,default=1)
    time=models.CharField(max_length=100)
    date=models.CharField(max_length=15, default="")
    ticket_price = models.IntegerField(default=150)
    total_price =  models.IntegerField(default=150)
    no_of_seats=models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    film_name = models.CharField(max_length=255, default='unknown')
