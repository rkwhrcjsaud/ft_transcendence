from django.urls import path
from .views import Oauth42RegisterView

urlpatterns = [
    path('', Oauth42RegisterView.as_view(), name='oauth42_register'),

]