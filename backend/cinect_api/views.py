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
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('facebookid'):
            user = User()
            user.email = request.POST.get('email')
            user.facebookid = request.POST.get('facebookid')
            user.save()
        return HttpResponse({'email': request.POST.get('email'), 'facebookid': request.POST.get('facebookid')})
    else:
        email = request.GET.get('email')
        response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=1")
        movies = response.json()['results']
        x = random.randint(0, 8)
        return HttpResponse(json.dumps(movies[x]))


# Helper function to take value in pair to sort suggestions
def takeSecond(elem):
    return elem[1]

def groupSuggestion(request):
    groupid = request.GET.get('groupid')

    result = {}

     #  Get lists of users in groupid
    users = GroupUser.objects.filter(groupid__groupid=groupid).values('email')

    for i in range(0, len(users)):
        movies = SwipedRight.objects.filter(email__email=users[0]['email']).values('movieid')
        for j in range(0, len(movies)):
            if movies[i]['movieid'] in result:
                result[movies[i]['movieid']] = result[movies[i]['movieid']] + 1
            else:
                result[movies[i]['movieid']] = 1

    sortedResults = sorted(result, key=takeSecond, reverse=True)
    jsonResults = []
    
    for i in range(0, len(sortedResults)):
        response = requests.get("https://api.themoviedb.org/3/movie/"+sortedResults[i][0]+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        jsonResults.append({'movieTitle': response['title'], 'posterPath': response['poster_path'], 'count': sortedResults[i][1]})

    jsonResponse = {'data': jsonResults}
    return HttpResponse(json.dumps(jsonResponse))



# POST request handler for creating groups
def createGroup(request):
    if request.method == 'POST':
        groupname = request.POST.get('groupname')
        newGroup = Group()
        newGroup.groupname = groupname
        newGroup.save()

        users = request.POST.getlist('members')
        for i in range(len(users)):
            groupUserEntry = GroupUser()
            groupUserEntry.email = User.objects.get(facebookid=users[i])
            groupUserEntry.groupid = newGroup
            groupUserEntry.save()

# Gets a users list of groups - groupid, groupname
def getGroups(request):
    myemail = request.GET.get('email')
    groupids = GroupUser.objects.filter(email__email=myemail).values('groupid')

    groupinfo = []
    for i in range(0, len(groupids)):
        groupEntry = Group.objects.get(pk=groupids[i]['groupid'])
        groupinfo.append({'groupname': groupEntry.groupname, 'groupid': groupids[i]['groupid']})

    response = {'data': groupinfo}
    return HttpResponse(json.dumps(response))

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
        return HttpResponse(json.dumps(data))
    return HttpResponse(json.dumps(data))

def getUserMovies(request):
    useremail = request.GET.get('useremail')
    #get list of movie ids that user swiped right on
    movieids = SwipedRight.objects.filter(email__email='kate@example.com').values('movieid')
    response = []
    i = 0
    for id in movieids:
        if i > 7:
            break
        i += 1
        apiResponse = requests.get("https://api.themoviedb.org/3/movie/"+id['movieid']+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        response.append({'key': id['movieid'],
                         'posterpath': ("https://image.tmdb.org/t/p/w500/" + apiResponse['poster_path']),
                         'title': apiResponse['title']})
    httpResponse = {'data': response}
    return HttpResponse(json.dumps(httpResponse))
