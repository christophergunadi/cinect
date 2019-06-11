from django.db import models

class User(models.Model):
  email = models.EmailField(max_length=254, primary_key=True)
  facebookid  = models.CharField(max_length=255, unique=True, default='null')
  name = models.CharField(max_length=92, default='null')
  likesAction = models.BooleanField(default=False)
  likesComedy = models.BooleanField(default=False)
  likesThriller = models.BooleanField(default=False)
  likesAnimation = models.BooleanField(default=False)
  likesRomance = models.BooleanField(default=False)
  likesScifi = models.BooleanField(default=False)
  likesHorror = models.BooleanField(default=False)
  likesFamily = models.BooleanField(default=False)

  class Meta:
    db_table = 'users'
  def __str__(self):
    return '{}: {}'.format(self.facebookid, self.email)

class Movie(models.Model):
  movieid = models.CharField(max_length=10, primary_key=True)
  movietitle = models.CharField(max_length=100)
  posterpath = models.CharField(max_length=200)
  synopsis = models.CharField(max_length=600)
  rating = models.IntegerField()
  class Meta:
    db_table = 'movies'
  def _str_(self):
    return '{}: {}, {}, {}, {}'.format(self.movieid, self.movietitle, self.posterpath, self.synopsis, self.rating)

class SwipedRight(models.Model):
  swiperightid = models.AutoField(primary_key=True)
  email = models.ForeignKey(User, on_delete=models.CASCADE)
  movieid = models.ForeignKey(Movie, on_delete=models.CASCADE)
  class Meta:
    db_table = 'swipedright'
    unique_together = ('email', 'movieid',)
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

class UserWatched(models.Model):
  userwatchedid = models.AutoField(primary_key=True)
  email = models.ForeignKey(User, on_delete=models.CASCADE)
  movieid = models.ForeignKey(Movie, on_delete=models.CASCADE)
  class Meta:
    db_table = 'userwatched'
    unique_together = ('email', 'movieid',)
  def __str__(self):
    return '{}: {} watched {}'.format(self.userwatchedid, self.email, self.movieid)
