from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight
from .models import User
from .models import Group
from .models import UserWatched

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

# Returns true if more than one person likes a movie
def filterLikedByMoreThanOne(elem):
    return int(elem[1]) > 1

def groupSuggestion(request):
    groupid = request.GET.get('groupid')

    result = {}

     #  Get lists of users in groupid
    users = GroupUser.objects.filter(groupid__groupid=groupid).values('email')

    for i in range(0, len(users)):
        movies = SwipedRight.objects.filter(email__email=users[i]['email']).values('movieid')
        for j in range(0, len(movies)):
            if movies[j]['movieid'] in result:
                result[movies[j]['movieid']] = result[movies[j]['movieid']] + 1
            else:
                result[movies[j]['movieid']] = 1

    sortedResults = sorted(result.items(), key=takeSecond, reverse=True)
    filteredResults = list(filter(filterLikedByMoreThanOne, sortedResults))
    jsonResults = []

    for i in range(0, len(filteredResults)):
        response = requests.get("https://api.themoviedb.org/3/movie/"+filteredResults[i][0]+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        jsonResults.append({'movieTitle': response['title'],
                            'posterPath': response['poster_path'],
                            'synopsis': response['overview'],
                            'count': filteredResults[i][1]})

    jsonResponse = {'data': jsonResults}
    return HttpResponse(json.dumps(jsonResponse))


def getMembers(request):
    groupid = request.GET.get('groupid')
    members = GroupUser.objects.filter(groupid__groupid=groupid).values('email')
    response = []
    for i in range(0, len(members)):
        email = User.objects.get(pk=members[i]['email'])
        response.append({'name': email.email })

    return HttpResponse(json.dumps({'data': response}))


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
    movieids = SwipedRight.objects.filter(email__email=useremail).values('movieid')
    response = []
    for id in movieids:
        apiResponse = requests.get("https://api.themoviedb.org/3/movie/"+id['movieid']+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        response.append({'key': id['movieid'],
                         'posterpath': ("https://image.tmdb.org/t/p/w500/" + apiResponse['poster_path']),
                         'title': apiResponse['title'],
                         'synopsis': apiResponse['overview']})
    httpResponse = {'data': response}
    return HttpResponse(json.dumps(httpResponse))

def deleteSwipedRight(request):
    data = {}
    if request.method == 'POST':
        #print(request.POST.get
        if request.POST.get('email') and request.POST.get('movieid'):
            email = request.POST.get('email')
            movieid = request.POST.get('movieid')

            SwipedRight.objects.filter(email__email=email).get(movieid=movieid).delete()

            print('deleting '+email+',movieid'+movieid)
            return HttpResponse(getMovieByID(movieid))
        return HttpResponse(json.dumps(data))
    return HttpResponse(json.dumps(data))

def getUserWatched(request):
    useremail = request.GET.get('useremail')
    #get list of movie ids that user swiped right on
    movieids = UserWatched.objects.filter(email__email=useremail).values('movieid')
    response = []
    for id in movieids:
        apiResponse = requests.get("https://api.themoviedb.org/3/movie/"+id['movieid']+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        response.append({'key': id['movieid'],
                         'posterpath': ("https://image.tmdb.org/t/p/w500/" + apiResponse['poster_path']),
                         'title': apiResponse['title'],
                         'synopsis': apiResponse['overview']})
    httpResponse = {'data': response}
    return HttpResponse(json.dumps(httpResponse))