from django.http import HttpResponse
from .models import GroupUser
from .models import SwipedRight
from .models import User
from .models import Group
from .models import UserWatched
from .models import Movie
from .models import UserRating

import requests
import json
import random

genresDict = {'Action': 28,
     'Comedy': 35,
     'Thriller': 53,
     'Animation': 16,
     'Romance': 10749,
     'Scifi': 878,
     'Horror': 27,
     'Family': 10751
    }

class MovieContainer():
    def __init__(self, movieObject):
        self.movieObject = movieObject
    def __eq__(self, other):
        return self.movieObject['id'] == other.movieObject['id']
    def __hash__(self):
        return self.movieObject['id']

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

def rateMovie(request):
    rating = UserRating()
    rating.stars = int(request.POST.get('stars'))
    rating.comment = request.POST.get('comment')
    rating.movieid = getMovieByID(request.POST.get('movieid'))
    rating.email = User.objects.filter(pk=request.POST.get('email')).first()
    rating.save()

    return HttpResponse({})

def getUserProfile(request):
    facebookid = request.GET.get('facebookid')
    user = User.objects.get(facebookid=facebookid)

    # Number of movies he/she has watched
    moviesWatched = UserWatched.objects.filter(email__email=user.email)
    numMovies = 0
    for id in moviesWatched:
        numMovies = numMovies + 1
    
    # Movies that they have rated
    ratedMovies = UserRating.objects.filter(email__email=user.email)
    ratedMovieInfo = []
    for i in range(0, len(ratedMovies)):
        ratedMovieInfo.append({
            'movieTitle': Movie.objects.filter(pk=ratedMovies[i].movieid.movieid).first().movietitle,
            'stars': ratedMovies[i].stars,
            'comment': ratedMovies[i].comment,
        })
        
    return HttpResponse(json.dumps({'count': numMovies, 'ratedMovies': ratedMovieInfo}))

def getMovieRatings(request):
    movieid = request.GET.get('movieid')
    useremail = request.GET.get('email')
    movieratings = UserRating.objects.filter(movieid__movieid=movieid)
    movieratingsinfo = []
    for i in range(0, len(movieratings)):
        rateemail = movieratings[i].email.email
        if rateemail == useremail:
            continue
        user = User.objects.get(pk=rateemail)
        movieratingsinfo.append({
            'name': user.name,
            'stars': movieratings[i].stars,
            'comment': movieratings[i].comment,
        })

    return HttpResponse(json.dumps({'movieRatings': movieratingsinfo}))


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

# Get movies for user to swiped on based on their preferences.
# Returns 20 movies from most popular overall + 20 movies from each preference, randomised.
def getMoviesForUser(request):
    global x
    email = request.GET.get('email')
    page = request.GET.get('page')

    print("PAGE: " + page)

    user = User.objects.get(pk=email)
    preferences = []
    if user.likesAction : preferences.append(genresDict.get('Action'))
    if user.likesComedy : preferences.append(genresDict.get('Comedy'))
    if user.likesThriller : preferences.append(genresDict.get('Thriller'))
    if user.likesAnimation : preferences.append(genresDict.get('Animation'))
    if user.likesRomance : preferences.append(genresDict.get('Romance'))
    if user.likesScifi : preferences.append(genresDict.get('Scifi'))
    if user.likesHorror : preferences.append(genresDict.get('Horror'))
    if user.likesFamily : preferences.append(genresDict.get('Family'))

    movies = []

    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=" + page)
    responseMovies = response.json()['results']

    for i in range(0, len(responseMovies)):
        movies.append(MovieContainer({
            'uri': ("https://image.tmdb.org/t/p/w500" + responseMovies[i]['poster_path']),
            'id': responseMovies[i]['id']
        }))

    for preference in preferences:
        response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&with_genres=" + str(preference) + "&page=" + page)
        responseMovies = response.json()['results']

        for i in range(0, len(responseMovies)):
            movies.append(MovieContainer({
                'uri': ("https://image.tmdb.org/t/p/w500" + responseMovies[i]['poster_path']),
                'id': responseMovies[i]['id']
            }))

    movies = list(set(movies))

    movies = list(map(lambda m : m.movieObject, movies))

    random.shuffle(movies)

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

def getUserMovies(request):
    useremail = request.GET.get('useremail')
    #get list of movie ids that user swiped right on
    movieids = SwipedRight.objects.filter(email__email=useremail).values('movieid')
    watched = UserWatched.objects.filter(email__email=useremail).values('movieid')
    movieids = movieids.difference(watched)

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
            movie = getMovieByID(movieid)
            userWatched.movieid = movie
            userWatched.save()

            print('adding' + email + ', movieid' + movieid)

            return HttpResponse(getMovieByID(movieid))
        return HttpResponse(json.dumps(data))
    return HttpResponse(json.dumps(data))

def searchMovie(request):
  query = request.GET.get('query')
  apiResponse = requests.get("https://api.themoviedb.org/3/search/movie?api_key=edf754f30aad617f73e80dc66b5337d0&query=" + query).json()
  searchResults = apiResponse['results']

  response = []
  for i in range(0, len(searchResults)):
    searchResult = searchResults[i]
    response.append({
      'movieid': searchResult['id'],
      'movieTitle': searchResult['title'],
      'posterPath': "https://image.tmdb.org/t/p/w500/" + str(searchResult['poster_path']),
      'synopsis': searchResult['overview'],
      'rating': searchResult['vote_average']
    })

  jsonResponse = {'data': response}
  return HttpResponse(json.dumps(jsonResponse))
