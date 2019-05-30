from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight

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
    users = GroupUser.objects.filter(groupid__groupid=groupid)
    movies = SwipedRight.objects.filter(username__username=str(users[0])).values('imdbid')

    for i in range(1, len(users)):
        otherMovies = SwipedRight.objects.filter(username__username=str(users[i])).values('imdbid')
        movies = movies.intersection(otherMovies)
        
    # Else use AI model

    return HttpResponse(movies)
