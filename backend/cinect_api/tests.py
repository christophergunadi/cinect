from django.test import SimpleTestCase
from .views import user
from django.test.client import RequestFactory

# Create your tests here.
class ExternalAPITest(SimpleTestCase):
    def setUp(self):
      self.factory = RequestFactory()

    def test_if_can_call_external_api(self):
      request = self.factory.get('/user?username=Alexander')
      self.assertIsNotNone(user(request))
    