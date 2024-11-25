from django.urls import path
from .views import *

urlpatterns = [
    path('42/', Oauth42RegisterView.as_view()),

]