from django.db import models

class User(models.Model):
  email = models.EmailField(max_length=254, primary_key=True)
  class Meta:
    db_table = 'users'
  def __str__(self):
    return self.email

class SwipedRight(models.Model):
  swiperightid = models.AutoField(primary_key=True)
  email = models.ForeignKey(User, on_delete=models.CASCADE)
  movieid = models.CharField(max_length=10)
  class Meta:
    db_table = 'swipedright'
  def __str__(self):
    return '{}: {} swiped {}'.format(self.swiperightid, self.email, self.movieid)

class Group(models.Model):
  groupid = models.AutoField(primary_key=True)
  groupname = models.CharField(max_length=17)
  class Meta:
    db_table = 'groups'
  def __str__(self):
    return '{}: {}'.format(self.groupid, self.groupname)

class GroupUser(models.Model):
  groupuserid = models.AutoField(primary_key=True)
  groupid = models.ForeignKey(Group, on_delete=models.CASCADE)
  email = models.ForeignKey(User, on_delete=models.CASCADE)
  class Meta:
    db_table = 'groupusers'
  def _str_(self):
    return '{}: {} in group {}'.format(self.groupuserid, self.email, self.groupid)
