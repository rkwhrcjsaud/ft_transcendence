from rest_framework import serializers
from .models import User, UserProfile, UserStats
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

class RegisterSerializer(serializers.ModelSerializer):
    """
    사용자 등록에 사용하는 Serializer.
    """
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)
    password2 = serializers.CharField(max_length=128, min_length=8, write_only=True)
    nickname = serializers.CharField(max_length=40, required=False, allow_blank=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'nickname', 'password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password', '')
        password2 = attrs.get('password2', '')
        if (password != password2):
            raise serializers.ValidationError({'password': 'Passwords must match'})
        if not attrs.get('nickname'):
            attrs['nickname'] = 'guest'
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
            nickname=validated_data['nickname'],
            password=validated_data['password']
        )
        UserStats.objects.create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """
    사용자 프로필 데이터를 처리하는 Serializer.
    """
    class Meta:
        model = UserProfile
        fields = ['nickname']

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
            'full_name': user.get_full_name(),
            'access_token': str(user_tokens['access']),
            'refresh_token': str(user_tokens['refresh'])
        }

class VerifyEmailSerializer(serializers.ModelSerializer):
    pass