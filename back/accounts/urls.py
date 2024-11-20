from django.urls import path
from .views import RegisterView, ProfileView, UserStatsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('stats/', UserStatsView.as_view(), name='stats'),
]