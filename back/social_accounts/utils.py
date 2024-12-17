from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import requests
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from accounts.models import User, UserStats
from ..vault import *
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from manage import getSecretValue

def RegisterSocialAccount(email, username, nickname, firstName, lastName, img_URL):
    user = User.objects.filter(email=email)
    if user.exists():
        register_userd=authenticate(email=email, password=settings.SOCIAL_AUTH_PASSWORD)
        tokens = register_userd.tokens()
        print(register_userd)
        return {
            'id':register_userd.id,
			'full_name':register_userd.get_full_name,
			'username': register_userd.username,
			'email':register_userd.email,
			'auth_provider': '42',
			'access_token': str(tokens.get('access')),
			'refresh_token': str(tokens.get('refresh'))
		}
    else:
        user = {
			'email': email,
			'username': username,
   			'nickname': nickname,
			'first_name': firstName,
			'last_name': lastName,
			'password': settings.SOCIAL_AUTH_PASSWORD,
			'auth_provider': '42',
		}
        user = User.objects.create_user(**user)
        user.is_verified = True
        user.is_online = True
        #add_profile_image(user, img_URL)
        user.save()
        login_user = authenticate(email=email, password=settings.SOCIAL_AUTH_PASSWORD)

        tokens = login_user.tokens()
        UserStats.objects.create(user=user)
        return {
			'id': login_user.id,
			'email': login_user.email,
			'username': login_user.username,
			'full_name': login_user.get_full_name,
			'access_token': str(tokens.get('access')),
			'refresh_token': str(tokens.get('refresh'))
		}

class SocialAccount42:
    @staticmethod
    def TokenFromCode(code): # 42 API로부터 access token을 받아옴
        Params = {
            "grant_type": "authorization_code",
            "client_id": settings.CLIENT_ID_42,
            "client_secret": settings.CLIENT_SECRET_42,
            "code": code,
            "redirect_uri": f"https://{settings.DOMAIN}/42"
        } # 42 API로 보낼 파라미터
        response = requests.post(
            getSecretValue("back/BACK_API_OAUTH_TOKEN"),
            params=Params,
            headers={'Accept': 'application/json'}
        )
        access_token = response.json().get('access_token')
        if not access_token:
            raise AuthenticationFailed(response.json(), 401)
        return access_token

    @staticmethod
    def Get42User(access_token): # 42 API로부터 유저 정보를 받아옴
        response = requests.get(
            getSecretValue("back/BACK_API_USER"),
            headers={'Authorization': f"Bearer {access_token}"}
        )
        response.raise_for_status()
        return response.json()
