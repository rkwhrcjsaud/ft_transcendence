from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    """
    사용자(User) 생성과 관련된 커스텀 매니저.
    """
    def create_user(self, email, username, password=None, **extra_fields):
        """
        일반 사용자를 생성하는 메서드.
        이메일과 사용자명을 필수로 검증.
        """
        if not email:
            raise ValueError(_('The Email field must be set'))
        if not username:
            raise ValueError(_('The Username field must be set'))
        try:
            validate_email(email) # 이메일 형식 검증
        except ValidationError:
            raise ValidationError(_('The Email field must be a valid email address'))
        email = self.normalize_email(email) # 이메일 정규화
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password) # 비밀번호 암호화
        user.save()
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        """
        관리자(superuser) 생성 메서드.
        기본적으로 `is_staff`와 `is_superuser`를 활성화.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, **extra_fields)
    
    def email_validator(self, email):
        """
        이메일의 유효성을 별도로 검증하는 메서드.
        """
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_('The Email field must be a valid email address'))
        return email