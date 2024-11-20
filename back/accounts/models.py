from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import MaxLengthValidator, MinLengthValidator
from .managers import UserManager
from rest_framework_simplejwt.tokens import RefreshToken

class User(AbstractBaseUser, PermissionsMixin):
    """
    커스텀 사용자 모델. Django 기본 User 모델을 대체.
    """
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True, validators=[MaxLengthValidator(40), MinLengthValidator(3)])
    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_image = models.ImageField(upload_to='profile_images/', default='default.png')
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )

    # 인증에 사용될 필드를 이메일로 설정
    USERNAME_FIELD = 'email'
    # 필수 입력 필드
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = UserManager()

    def token(self):
        """
        JWT 토큰 생성 메서드.
        """
        token = RefreshToken.for_user(self)
        return {
            'refresh': str(token),
            'access': str(token.access_token),
        }

class UserProfile(models.Model):
    """
    사용자 프로필 모델. 추가 정보 저장.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=40, unique=True, blank=True, null=True)

class UserStats(models.Model):
    """
    사용자 게임 통계 모델.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    rating = models.IntegerField(default=1000, validators=[MinLengthValidator(0)])
