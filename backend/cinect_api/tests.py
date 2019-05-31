from django.test import SimpleTestCase
from .views import user
from django.test.client import RequestFactory
from django.urls import reverse

# Create your tests here.
class ExternalAPITest(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_if_can_call_external_api(self):
        request = self.factory.get('/user?username=Alexander')
        self.assertIsNotNone(user(request))

class CinectAPITest(SimpleTestCase):
    def test_user_status_code(self):
        response = self.client.get(reverse('user'))
        self.assertEquals(response.status_code, 200)
    
    def test_swiperight_status_code(self):
        response = self.client.get(reverse('addswipedright'))
        self.assertEquals(response.status_code, 200)
    
   
