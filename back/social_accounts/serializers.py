from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .utils import SocialAccount42, RegisterSocialAccount

class Oauth42RegisterSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)

    def validate_code(self, code):
        print("Received code:", code)  # 받은 인증 코드 출력

        accessToken = SocialAccount42.TokenFromCode(code)

        if accessToken:
            print("Access token received:", accessToken)  # 토큰 출력

            try:
                userData = SocialAccount42.Get42User(accessToken)  # 42 API로부터 유저 정보를 받아옴
                print("User data received:", userData)  # 유저 데이터 출력
                
                # 필드에 값이 제대로 들어왔는지 확인
                email = userData.get('email', 'No email found')
                username = userData.get('login', 'No username found')
                nickname = userData.get('login', 'No nickname found')
                firstname = userData.get('first_name', 'No first name found')
                lastname = userData.get('last_name', 'No last name found')
                img_URL = userData.get('image', {}).get('versions', {}).get('small', 'No image URL found')
                
                print(f"Email: {email}, Username: {username}, First Name: {firstname}, Last Name: {lastname}, Image URL: {img_URL}")
                
                # 사용자 등록
                return RegisterSocialAccount(email, username, firstname, lastname, nickname, img_URL)
            
            except KeyError as e:
                raise ValidationError(f"Missing expected key in user data: {e}")
            except Exception as e:
                raise ValidationError(f"An error occurred while fetching user data: {str(e)}")
        else:
            raise ValidationError("Token invalid or has expired")
