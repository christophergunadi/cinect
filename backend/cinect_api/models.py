from django.db import models

class User(models.Model):
  username = models.CharField(max_length=20, primary_key=True)
  class Meta:
    db_table = 'users'

class SwipedRight(models.Model):
  swiperightid = models.AutoField(default=-1, primary_key=True)
  username = models.ForeignKey(User, on_delete=models.CASCADE)
  movieid = models.CharField(max_length=10)
  class Meta:
    db_table = 'swipedright'
  def _str_(self):
    return '{}: {} swiped {}'.format(self.swiperightid, self.username, self.movieid)

class Group(models.Model):
  groupid = models.IntegerField(default=-1, primary_key=True)
  groupname = models.CharField(max_length=17)
  class Meta:
    db_table = 'groups'

class GroupUser(models.Model):
  groupuserid = models.IntegerField(default=-1, primary_key=True)
  groupid = models.ForeignKey(Group, on_delete=models.CASCADE)
  username = models.CharField(max_length=20)
  class Meta:
    db_table = 'groupusers'
  def _str_(self):
    return '{}: {} in group {}'.format(self.groupuserid, self.username, self.groupid)
