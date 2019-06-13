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
    path('addwatched', csrf_exempt(views.addUserWatchedFromHomeScreen), name='addwatched'),
    path('getmovies', views.getMoviesForUser, name='getmovies'),
    path('friendswholike', csrf_exempt(views.friendsWhoLike), name='friendswholike'),
    path('updatepreferences', csrf_exempt(views.updatePreferences), name='updatepreferences'),
    path('getpreferences', csrf_exempt(views.getPreferences), name='getpreferences'),
    path('search', csrf_exempt(views.searchMovie), name='search'),
    path('rateMovie', csrf_exempt(views.rateMovie), name='ratemovie'),
    path('getuserprofile', views.getUserProfile, name='getuserprofile'),
    path('getmovieratings', views.getMovieRatings, name='getmovieratings'),
    path('getcommonmovieswith', views.getCommonMoviesWith, name='getcommonmovieswith'),
    path('pressgroupwatched', csrf_exempt(views.addUserWatchedFromGroupScreen), name='pressgroupwatched'),
]
