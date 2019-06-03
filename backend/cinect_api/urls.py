from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user', views.user, name='user'),
    path('suggest', views.groupSuggestion, name='suggest'),
    path('addswipedright', csrf_exempt(views.addSwipedRight), name='addswipedright')
    path('creategroup', csrf_exempt(views.createGroup), name='creategroup')
    path('getgroups',views.getGroups, name='getgroups')
]
