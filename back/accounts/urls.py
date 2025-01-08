from django.urls import path, include
from .views import RegisterView, ProfileView, UserStatsView, TestJWTAuth, LogoutView, LoginView, VerifyEmailView, MatchHistoryView, UserListView, MyUserView, ChangePasswordView, UserDeleteView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers


router = routers.DefaultRouter()

urlpatterns = [
    path('userlist/', UserListView.as_view(), name='userlist'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('stats/', UserStatsView.as_view(), name='stats'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/', TestJWTAuth.as_view(), name='auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify/', VerifyEmailView.as_view(), name='verify'),
    path('match_history/', MatchHistoryView.as_view(), name='match_history'),
    path('myuser/', MyUserView.as_view(), name='myuser'),
    path('delete/', UserDeleteView.as_view(), name='user-delete'),
    path('', include(router.urls)),
]