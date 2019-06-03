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
    path('getswipedright', views.getUserMovies, name='getswipedright')
]
