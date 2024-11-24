import random
from django.core.mail import EmailMessage
from .models import User, OTP
from django.conf import settings

def generate_otp_code():
    """
    6자리의 랜덤한 숫자로 이루어진 인증 코드를 생성하는 메서드.
    """
    otp_code = random.randint(100000, 999999)
    return otp_code

def send_code_to_user(email):
    """
    사용자에게 인증 코드를 전송하는 메서드.
    """
    subject="Transcendence 회원가입 인증 코드"
    otp_code = generate_otp_code()
    print(otp_code)
    user = User.objects.get(email=email)
    current_site = "transcendence@42.com"
    email_body = f"안녕하세요 ${user.username}님! 회원가입을 위한 인증 코드는 {otp_code}입니다."
    from_email = settings.DEFAULT_FROM_EMAIL

    OTP.objects.create(user=user, code=otp_code)

    email = EmailMessage(subject=subject, body=email_body, from_email=from_email, to=[email])
    email.send(fail_silently=True) # 실패 시 에러를 무시하고 진행

    