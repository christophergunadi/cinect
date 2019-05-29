from django.db import models

class User(models.Model):
  username = models.CharField(max_length=20, primary_key=True)
  class Meta:
    db_table = 'users'

class SwipedRight(models.Model):
  swiperightid = models.IntegerField(default=-1, primary_key=True)
  username = models.CharField(max_length=20)
  imdbid = models.CharField(max_length=10)
  class Meta:
    db_table = 'swipedright'

# Create your models here.
