from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight
from .models import User
from .models import Group
from .models import UserWatched
from .models import Movie

import requests
import json
import random


x = 1

def index(request):
    return HttpResponse("Hello, world.")

# Gets a random movie and returns it
def user(request):
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('facebookid') and request.POST.get('name'):
            user = User()
            user.email = request.POST.get('email')
            user.facebookid = request.POST.get('facebookid')
            user.name = request.POST.get('name')
            user.save()
        return HttpResponse({'email': request.POST.get('email'), 'facebookid': request.POST.get('facebookid'), 'name': request.POST.get('name')})
    # else:
    #     email = request.GET.get('email')
    #     response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=1")
    #     movies = response.json()['results']
    #     x = random.randint(0, 8)
    #     return HttpResponse(json.dumps(movies[x]))

def updatePreferences(request): 
    email = request.POST.get('email') 
 
    user = User.objects.filter(pk=email).update(likesAction=(request.POST.get('Action') == 'true')) 
    user = User.objects.filter(pk=email).update(likesComedy=(request.POST.get('Comedy') == 'true')) 
    user = User.objects.filter(pk=email).update(likesThriller=(request.POST.get('Thriller') == 'true')) 
    user = User.objects.filter(pk=email).update(likesAnimation=(request.POST.get('Animation') == 'true')) 
    user = User.objects.filter(pk=email).update(likesRomance=(request.POST.get('Romance') == 'true')) 
    user = User.objects.filter(pk=email).update(likesScifi=(request.POST.get('Scifi') == 'true')) 
    user = User.objects.filter(pk=email).update(likesHorror=(request.POST.get('Horror') == 'true')) 
    user = User.objects.filter(pk=email).update(likesFamily=(request.POST.get('Family') == 'true')) 
 
    return HttpResponse(json.dumps({})) 

def getPreferences(request):
    email = request.GET.get('email')
    user = User.objects.get(pk=email)
    jsonResponse = {
        'Action': user.likesAction,
        'Comedy': user.likesComedy,
        'Thriller': user.likesThriller,
        'Animation': user.likesAnimation,
        'Romance': user.likesRomance,
        'Scifi': user.likesScifi,
        'Horror': user.likesHorror,
        'Family': user.likesFamily
    }

    return HttpResponse(json.dumps(jsonResponse))

def getMoviesForUser(request):
    global x
    email = request.GET.get('email')
    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=" + str(x))
    x = x + 1
    responseMovies = response.json()['results']
    
    movies = []

    for i in range(0, len(responseMovies)):
        movies.append({
            'uri': ("https://image.tmdb.org/t/p/w500" + responseMovies[i]['poster_path']),
            'id': responseMovies[i]['id']
        })

    jsonResponse = {'data': movies}
    return HttpResponse(json.dumps(jsonResponse))

# Helper function to take value in pair to sort suggestions
def takeSecond(elem):
    return elem[1]

# Returns true if more than one person likes a movie
def filterLikedByMoreThanOne(elem):
    return int(elem[1]) > 1

def friendsWhoLike(request):
    movieid = request.POST.get('movieid')
    friendids = request.POST.getlist('friendids')
    friendnames = request.POST.getlist('friendnames')

    friendsWhoAlsoLike = []
    
    for i in range(len(friendids)):
        email = User.objects.get(facebookid=friendids[i])
        like = SwipedRight.objects.filter(email__email=email.email).filter(movieid__movieid=movieid)
        if like.exists():
            friendsWhoAlsoLike.append(friendnames[i])

    return HttpResponse(json.dumps({'data': friendsWhoAlsoLike}))




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
        response.append({'name': email.name, 'facebookid': email.facebookid})

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
    movie = Movie.objects.filter(pk=id).first()
    response = []
    if movie is None:
        print("aoisjdoAJISODJASODSA")
        response = requests.get("https://api.themoviedb.org/3/movie/"+id+"?api_key=edf754f30aad617f73e80dc66b5337d0").json()
        movie = Movie()
        movie.movieid = id
        movie.movietitle = response['title']
        movie.posterpath = response['poster_path']
        movie.synopsis = response['overview']
        movie.rating = response['vote_average']
        movie.save()

    return movie

def formatMovieToJson(movie):
        return json.dumps({'movieTitle': movie.movietitle, 'posterPath': movie.posterpath})

def addSwipedRight(request): #adds movie into user's watchlist database
    data = {}
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('movieid'):
            swipedRight = SwipedRight()
            user = User.objects.get(email=request.POST.get('email'))
            swipedRight.email = user
            movieid = request.POST.get('movieid')
            movie = getMovieByID(movieid)

            swipedRight.movieid = movie
            swipedRight.save()

            response = formatMovieToJson(movie)
            return HttpResponse(response)
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
                         'synopsis': apiResponse['overview'],
                         'rating': apiResponse['vote_average']})
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
            return HttpResponse(formatMovieToJson(getMovieByID(movieid)))
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

def addUserWatched(request):
    data = {}
    #delete from swiped right
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('movieid'):
            email = request.POST.get('email')
            movieid = request.POST.get('movieid')

            SwipedRight.objects.filter(email__email=email).get(movieid=movieid).delete()

            print('deleting '+email+',movieid'+movieid)

            #add to user watched
            userWatched = UserWatched()
            user = User.objects.get(email=email)
            userWatched.email = user
            movie = getMovieByID(movieid)
            userWatched.movieid = movie
            userWatched.save()

            print('adding' + email + ', movieid' + movieid)

            return HttpResponse(formatMovieToJson(movie))
        return HttpResponse(json.dumps(data))
    return HttpResponse(json.dumps(data))

def addUserWatchedFromHomeScreen(request):
    data = {}
    if request.method == 'POST':
        if request.POST.get('email') and request.POST.get('movieid'):
            email = request.POST.get('email')
            movieid = request.POST.get('movieid')

            #add to user watched
            userWatched = UserWatched()
            user = User.objects.get(email=email)
            userWatched.email = user
            userWatched.movieid = movieid
            userWatched.save()

            print('adding' + email + ', movieid' + movieid)

            return HttpResponse(getMovieByID(movieid))
        return HttpResponse(json.dumps(data))
    return HttpResponse(json.dumps(data))
