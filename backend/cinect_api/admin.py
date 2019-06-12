from django.contrib import admin
from .models import User, SwipedRight, Group, GroupUser, UserWatched, Movie

admin.site.register(User)
admin.site.register(SwipedRight)
admin.site.register(Group)
admin.site.register(GroupUser)
admin.site.register(UserWatched)
admin.site.register(Movie)
admin.site.register(UserRating)

# Register your models here.
