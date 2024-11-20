from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User, UserProfile, UserStats
from .serializers import RegisterSerializer, ProfileSerializer, UserStatsSerializer

class RegisterView(generics.CreateAPIView):
    """
    회원가입을 처리하는 View.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    프로필 조회 및 수정 View.
    """
    queryset = UserProfile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserStatsView(generics.RetrieveAPIView):
    """
    사용자 통계 조회 View.
    """
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
    permission_classes = [permissions.IsAuthenticated]

