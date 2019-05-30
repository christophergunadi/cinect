from django.db import models

class User(models.Model):
  username = models.CharField(max_length=20, primary_key=True)
  class Meta:
    db_table = 'users'
  def __str__(self):
    return self.username

class SwipedRight(models.Model):
  swiperightid = models.IntegerField(default=-1, primary_key=True)
  username = models.CharField(max_length=20)
  imdbid = models.CharField(max_length=10)
  class Meta:
    db_table = 'swipedright'
  def __str__(self):
    return f'{self.username}, {self.imdbid}'
# Create your models here.
