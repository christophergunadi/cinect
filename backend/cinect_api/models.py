from django.db import models

class Users(models.Model):
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

class Groups(models.Model):
  groupid = models.IntegerField(default=-1, primary_key=True)
  groupname = models.CharField(max_length=17)
  class Meta:
    db_table = 'groups'

class GroupUsers(models.Model):
  groupuserid = models.IntegerField(default=-1, primary_key=True)
  groupid = models.IntegerField(default=-1)
  username = models.CharField(max_length=20)
  class Meta:
    db_table = 'groupusers'
