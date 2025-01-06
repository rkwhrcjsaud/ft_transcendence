from rest_framework import serializers
from .models import User, UserProfile, UserStats, MatchHistory
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

class UserSerializer(serializers.ModelSerializer):
    """
    사용자 정보를 처리하는 Serializer.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'nickname', 'is_active', 'is_online', 'is_verified', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'auth_provider']

class RegisterSerializer(serializers.ModelSerializer):
    """
    사용자 등록에 사용하는 Serializer.
    """
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)
    password2 = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password', '')
        password2 = attrs.get('password2', '')
        if (password != password2):
            raise serializers.ValidationError({'password': 'Passwords must match'})
        if not attrs.get('username'):
            attrs['username'] = attrs['email']  # `username`을 `email`로 기본 설정
        return attrs

    def create(self, validated_data):
        """
        새로운 User 객체를 생성.
        """
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            nickname='guest'  # 기본 닉네임 설정
        )
        UserStats.objects.create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """
    사용자 프로필을 처리하는 Serializer.
    """
    class Meta:
        model = UserProfile
        fields = ['nickname', 'profile_image', 'first_name', 'last_name', 'email', 'auth_provider']
        read_only_fields = ['auth_provider']

class UserStatsSerializer(serializers.ModelSerializer):
    """
    사용자 통계 데이터를 처리하는 Serializer.
    """
    class Meta:
        model = UserStats
        fields = ['wins', 'losses', 'rating']

class LogoutSerializer(serializers.ModelSerializer):
    """
    로그아웃 시 사용하는 Serializer.
    """
    refresh_token = serializers.CharField()

    default_error_messages = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh_token']
        return attrs
    
    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            user_id = token.payload['user_id']
            user = User.objects.get(id=user_id)
            token.blacklist()
            user.is_online = False
            user.save()
        except TokenError:
            return self.fail('bad_token')
        
class LoginSerializer(serializers.ModelSerializer):
    """
    로그인 시 사용하는 Serializer.
    """
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255)
    username = serializers.CharField(max_length=255, read_only=True)
    nickname = serializers.CharField(max_length=255, read_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'full_name', 'nickname', 'access_token', 'refresh_token']
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')

        user = authenticate(request, email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credential')
        if user.auth_provider != 'email':
            raise PermissionDenied('please sign in with your social account')
        if not user.is_verified:
            raise AuthenticationFailed('Account is not verified')
        
        user.is_online = True
        user.save()

        user_tokens = user.tokens()

        return {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'nickname': user.nickname,
            'full_name': user.get_full_name,
            'access_token': str(user_tokens['access']),
            'refresh_token': str(user_tokens['refresh'])
        }

class VerifyEmailSerializer(serializers.ModelSerializer):
    pass

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = ['user', 'opponent', 'result', 'score', 'date']