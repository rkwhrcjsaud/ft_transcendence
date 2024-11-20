from rest_framework import serializers
from .models import User, UserProfile, UserStats

class RegisterSerializer(serializers.ModelSerializer):
    """
    사용자 등록에 사용하는 Serializer.
    """
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}, # 비밀번호 필드는 쓰기 전용으로 설정
        }

    def create(self, validated_data):
        """
        새로운 User 객체를 생성.
        """
        user = User.objects.create_user(**validated_data)
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