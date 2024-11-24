from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, UserProfile, UserStats
from .serializers import RegisterSerializer, ProfileSerializer, UserStatsSerializer, LogoutSerializer, LoginSerializer
from .utils import send_code_to_user


class RegisterView(generics.GenericAPIView):
    """
    회원가입을 처리하는 View.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            user = serializer.data
            # send_code_to_user(user.email)
            return Response({
                'data': user,
                'message': 'pass-code sent to email'
            }, status=status.HTTP_201_CREATED)
        return Response({'message': 'failed to register view'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class TestJWTAuth(generics.GenericAPIView):
    """
    JWT 인증 테스트용 View.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {'message': 'Authenticated'}
        return Response(data, status=status.HTTP_200_OK)
    
class LogoutView(generics.GenericAPIView):
    """
    로그아웃 View.
    """
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print(request)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    
class LoginView(generics.GenericAPIView):
    """
    로그인 View.
    """
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
