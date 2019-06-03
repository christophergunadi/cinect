from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight
from .models import User
from .models import Group

import requests
import json
import random

def index(request):
    return HttpResponse("Hello, world.")

# Gets a random movie and returns it
def user(request):
    email = request.GET.get('email')
    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=1")
    movies = response.json()['results']
    x = random.randint(0, 8)
    return HttpResponse(json.dumps(movies[x]))

def groupSuggestion(request):
    groupid = request.GET.get('groupid')

    #  Get lists of users in groupid
    users = GroupUser.objects.filter(groupid__groupid=groupid).values('email')
    movies = SwipedRight.objects.filter(email__email=users[0]['email']).values('movieid')

    for i in range(1, len(users)):
        otherMovies = SwipedRight.objects.filter(email__email=users[i]['email']).values('movieid')
        movies = movies.intersection(otherMovies)

    # Else use AI model
    if not movies:
        return HttpResponse("No suitable movie for y'all")
    else:
        # Returns BEST movie (only one movie returned), todo return a list of movies
        return HttpResponse(getMovieByID(movies[0]['movieid']))

# POST request handler for creating groups
def createGroup(request):
    if request.method == 'POST':
        groupname = request.POST.get('groupname')
        members = request.POST.get('members')
        newGroup = Group()
        newGroup.groupname = groupname
        newGroupid = newGroup.save()

        for i in range(0, len(members)):
            groupUserEntry = GroupUser()
            groupUserEntry.groupuserid = User.objects.filter(facebookid__facebookid=members[i]['id']).values('email')[0]['email']
            groupUserEntry.groupid = newGroupid
            groupUserEntry.save()


# Gets a users list of groups - groupid, groupname
def getGroups(request):
    myemail = request.GET.get('email')
    groupids = GroupUser.objects.filter(email__email=myemail).values('groupid')

    groupinfo = []
    for i in range(0, len(groupids)):
        groupEntry = Group.objects.filter(groupid__groupid=groupids[i]['groupid'])
        groupinfo.append({'groupname': groupEntry[0]['groupname'], 'groupid': groupEntry[0]['groupid'])

    return HttpResponse(json.dumps({data: groupinfo}))

    
        

def getMovieByID(id):
    # response = requests.get("https://api.themoviedb.org/3/movie/299534?api_key=edf754f30aad617f73e80dc66b5337d0").json()
    response = requests.get("https://api.themoviedb.org/3/movie/"+id+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
    response = {'movieTitle': response['title'], 'posterPath': response['poster_path']}
    return HttpResponse(json.dumps(response))

def addSwipedRight(request): #adds movie into user's watchlist database
    data = {}
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('movieid'):
            swipedRight = SwipedRight()
            user = User.objects.get(email=request.POST.get('email'))
            swipedRight.email = user
            movieid = request.POST.get('movieid')
            swipedRight.movieid = movieid
            swipedRight.save()

            # data['email'] = swipedRight.email.email
            # data['movieid'] = swipedRight.movieid

            return HttpResponse(getMovieByID(movieid))
            # return HttpResponse(json.dumps(data))
            # return HttpResponse("successful")
        return HttpResponse(json.dumps(data))
    # elif request.method == 'GET':
    #     return getMovieByID(request.GET.get('id'))
    return HttpResponse(json.dumps(data))
