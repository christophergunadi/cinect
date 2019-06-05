from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user', csrf_exempt(views.user), name='user'),
    path('suggest', views.groupSuggestion, name='suggest'),
    path('addswipedright', csrf_exempt(views.addSwipedRight), name='addswipedright'),
    path('creategroup', csrf_exempt(views.createGroup), name='creategroup'),
    path('getgroups',views.getGroups, name='getgroups'),
    path('getswipedright', views.getUserMovies, name='getswipedright'),
    path('deleteswipedright', csrf_exempt(views.deleteSwipedRight), name='deleteswipedright'),
    path('getmembers', views.getMembers, name='getmembers'),
    path('getuserwatched', views.getUserWatched, name='getuserwatched'),
    path('presswatched', csrf_exempt(views.addUserWatched), name='presswatched'),
]
