from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight
from .models import User

import requests
import json
import random

def index(request):
    return HttpResponse("Hello, world.")

# Gets a random movie and returns it
def user(request):
    username = request.GET.get('username')
    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=1")
    movies = response.json()['results']
    x = random.randint(0, 8)
    return HttpResponse(json.dumps(movies[x]))

def groupSuggestion(request):
    groupid = request.GET.get('groupid')

    #  Get lists of users in groupid
    users = GroupUser.objects.filter(groupid__groupid=groupid).values('username')
    movies = SwipedRight.objects.filter(username__username=users[0]['username']).values('movieid')

    for i in range(1, len(users)):
        otherMovies = SwipedRight.objects.filter(username__username=users[i]['username']).values('movieid')
        movies = movies.intersection(otherMovies)
        
    # Else use AI model
    if not movies:
        return HttpResponse("No suitable movie for y'all")
    else:
        # return HttpResponse(movies[0]['movieid'])
        return HttpResponse(getMovieByID(movies[0]['movieid']))

def getMovieByID(id):
    response = requests.get("https://api.themoviedb.org/3/movie/299534?api_key=edf754f30aad617f73e80dc66b5337d0").json()
    response = {'movieTitle': response['belongs_to_collection']['name'], 'posterPath': response['belongs_to_collection']['poster_path']}
    return HttpResponse(json.dumps(response))

def addSwipedRight(request):
    data = {}
    if request.method == 'POST':
        if request.POST.get('username') and request.POST.get('movieid'):
            swipedRight = SwipedRight()
            user = User.objects.get(username=request.POST.get('username'))
            swipedRight.username = user
            swipedRight.movieid = request.POST.get('movieid')
            swipedRight.save()
            
            
            data['username'] = swipedRight.username.username
            data['movieid'] = swipedRight.movieid

            return HttpResponse(json.dumps(data))
            # return HttpResponse("successful")
    return HttpResponse(json.dumps(data))
    
