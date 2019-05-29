from django.http import HttpResponse

import requests
import json
import random



def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def user(request):
    username = request.GET.get('username')
    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=edf754f30aad617f73e80dc66b5337d0&sort_by=popularity.desc&page=1")
    movies = response.json()['results']
    x = random.randint(0, 8)
    return HttpResponse(json.dumps(movies[x]))
