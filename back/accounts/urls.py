from django.urls import path, include
from .views import RegisterView, ProfileView, UserStatsView, TestJWTAuth, LogoutView, LoginView, VerifyEmailView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers


router = routers.DefaultRouter()

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('stats/', UserStatsView.as_view(), name='stats'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/', TestJWTAuth.as_view(), name='auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify/', VerifyEmailView.as_view(), name='verify'),
    path('', include(router.urls)),
]