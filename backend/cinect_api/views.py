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

    # commonMovies = []
    # firstMovies = SwipedRight.objects.filter(username__username=str(users[0])) 
    # for i in range(0, len(firstMovies)):
    #      commonMovies.append(firstMovies[i])

    movies = SwipedRight.objects.filter(username__username=str(users[0])) 
    debug = list(movies)

    for i in range(1, len(users)):
        debug.append("//")
        newMovies = SwipedRight.objects.filter(username__username=str(users[i])) 
        temp = movies & newMovies
        movies = temp
        debug.append(temp)
        # debug = debug + list(newMovies)
        # debug.append(newMovies)
        
    return HttpResponse(debug)
