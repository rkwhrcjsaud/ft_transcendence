from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .utils import SocialAccount42, RegisterSocialAccount

class Oauth42RegisterSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)

    def validate_code(self, code):
        accessToken = SocialAccount42.TokenFromCode(code)

        if accessToken:
            userData = SocialAccount42.Get42User(accessToken) # 42 API로부터 유저 정보를 받아옴
            
            email = userData['email']
            username = userData['login']
            nickname = userData['login']
            firstname = userData['first_name']
            lastname = userData['last_name']
            img_URL = userData['image']['versions']['small']
            return RegisterSocialAccount(email, username, nickname, firstname, lastname, img_URL)
        else:
            raise ValidationError("token invalid or has expired")
