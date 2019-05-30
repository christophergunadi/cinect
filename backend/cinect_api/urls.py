from django.urls import path
# from cinect_api.views import UserViewSet
# from rest_framework.routers import DefaultRouter

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user', views.user, name='user'),
    path('suggest', views.groupSuggestion, name='suggest'),
    path('addswipedright', views.addSwipedRight, name='addswipedright')
]
