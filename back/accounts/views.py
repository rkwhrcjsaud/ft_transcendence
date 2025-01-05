from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, UserProfile, UserStats, OTP, MatchHistory
from .serializers import RegisterSerializer, ExtendedProfileSerializer, ProfileSerializer, UserStatsSerializer, LogoutSerializer, LoginSerializer, VerifyEmailSerializer, MatchHistorySerializer
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
    serializer_class = ExtendedProfileSerializer
    permission_classes = [permissions.AllowAny]  # 일단 인증 비활성화했음, 추후에 IsAuthenticated로 변경?

    def get_queryset(self):
        """
        인증된 사용자에 해당하는 UserProfile만 반환.
        """
        return UserProfile.objects.none()  # 테스트용: 빈 QuerySet 반환
        # return UserProfile.objects.filter(user=self.request.user) # 실제 사용 시 이렇게 사용(예시)

    def retrieve(self, request, *args, **kwargs):
        """
        Mock 데이터를 반환.
        """
        mock_data = {
            "nickname": "mocktest_user",
            "last_name": "Ran",
            "first_name": "Choi",
            "email": "mocktest@example.com",
            "profile_image": "default_profile.jpeg"
        }
        return Response(mock_data)

        # 실제 사용 시 이렇게 사용(예시)
        # try:
        #     user = request.user
        #     user_profile = user.userprofile  # One-to-One 관계로 연결된 UserProfile
        #     serializer = self.get_serializer(user_profile)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # except UserProfile.DoesNotExist:
        #     return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        """
        Mock 업데이트 응답.
        """
        return Response({"message": "Profile updated successfully"}, status=200)

        # 실제 사용 시 이렇게 사용(예시)
        # try:
        #     user_profile = request.user.userprofile
        #     serializer = self.get_serializer(user_profile, data=request.data, partial=True)
        #     serializer.is_valid(raise_exception=True)
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # except UserProfile.DoesNotExist:
        #     return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({'error': 'Invalid credentials, please try again'}, status=status.HTTP_401_UNAUTHORIZED)


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
        
class MatchHistoryView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MatchHistorySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            match_history = MatchHistory.objects.filter(user_id=user_id)
            serializer = self.serializer_class(match_history, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        