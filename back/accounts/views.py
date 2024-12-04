from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, UserProfile, UserStats, OTP
from .serializers import RegisterSerializer, ProfileSerializer, UserStatsSerializer, LogoutSerializer, LoginSerializer, VerifyEmailSerializer
import random
from django.conf import settings
from django.core.mail import send_mail

class RegisterView(generics.GenericAPIView):
    """
    회원가입을 처리하는 View.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def send_verification_email(self, user):
        """
        이메일로 인증 코드를 전송하는 메서드.
        """
        code = ''.join(random.choices('0123456789', k=6))

        subject = '회원가입을 위한 인증 코드입니다.'
        message = f'인증 코드: {code}'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)

        OTP.objects.create(user=user, code=code)

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)
        if (serializer.is_valid(raise_exception=True)):
            self.send_verification_email(serializer.save())
            user = serializer.data
            return Response({
                'data': user,
                'message': 'User created successfully. Check your email for verification code.'
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


class VerifyEmailView(generics.GenericAPIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data['code']
        email = request.data['email']
        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.get(user=user)
            if user.is_verified:
                return Response({'message': 'Email already verified'}, status=status.HTTP_204_NO_CONTENT)
            if otp.code == code:
                user.is_verified = True
                user.save()
                otp.delete()
                return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid code'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except OTP.DoesNotExist:
            return Response({'message': 'OTP does not exist'}, status=status.HTTP_404_NOT_FOUND)