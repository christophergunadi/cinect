from django.contrib import admin
from .models import Users, SwipedRight, Groups, GroupUsers

admin.site.register(Users)
admin.site.register(SwipedRight)
admin.site.register(Groups)
admin.site.register(GroupUsers)

# Register your models here.
