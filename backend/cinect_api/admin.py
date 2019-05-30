from django.contrib import admin
from .models import User, SwipedRight, Group, GroupUser

admin.site.register(User)
admin.site.register(SwipedRight)
admin.site.register(Group)
admin.site.register(GroupUser)

# Register your models here.
