from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    """
    사용자(User) 생성과 관련된 커스텀 매니저.
    """
    def create_user(self, email, username, first_name, last_name, password, **extra_fields):
        """
        일반 사용자를 생성하는 메서드.
        이메일과 사용자명을 필수로 검증.
        """
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_('The Email field must be set'))
        if not username:
            raise ValueError(_('The Username field must be set'))
        if not first_name:
            raise ValueError(_('The First Name field must be set'))
        if not last_name:
            raise ValueError(_('The Last Name field must be set'))
        
        # 닉네임 기본값 설정
        extra_fields.setdefault('nickname', 'guest')
        
        user = self.model(
            email=email, 
            username=username, 
            first_name=first_name, 
            last_name=last_name, 
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, password, **extra_fields):
        """
        관리자(superuser) 생성 메서드.
        기본적으로 `is_staff`와 `is_superuser`를 활성화.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)

        if (extra_fields.get('is_staff') is not True):
            raise ValueError(_('Superuser must have is_staff=True.'))
        if (extra_fields.get('is_superuser') is not True):
            raise ValueError(_('Superuser must have is_superuser=True.'))
        if (extra_fields.get('is_verified') is not True):
            raise ValueError(_('Superuser must have is_verified=True.'))

        user = self.create_user(email, username, first_name, last_name, password, **extra_fields)
        user.save(using=self._db)
        return user
    
    def email_validator(self, email):
        """
        이메일의 유효성을 별도로 검증하는 메서드.
        """
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_('The Email field must be a valid email address'))