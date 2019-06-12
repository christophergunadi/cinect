from django.test import SimpleTestCase
from .views import getMoviesForUser
from django.test.client import RequestFactory
from django.urls import reverse

# Create your tests here.

class CinectAPITest(SimpleTestCase):
    def test_swiperight_status_code(self):
        response = self.client.get(reverse('addswipedright'))
        self.assertEquals(response.status_code, 200)
    
   
