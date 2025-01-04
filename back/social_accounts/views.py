from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.generics import GenericAPIView
from django.conf import settings
from .serializers import Oauth42RegisterSerializer
from rest_framework.exceptions import ValidationError

# Create your views here.

class Oauth42RegisterView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = Oauth42RegisterSerializer

    def post(self, request):
        print("Request data:", request.data)  # 요청 데이터 출력
        serializer = self.serializer_class(data=request.data)
        
        # 유효성 검사
        if serializer.is_valid():
            print("Validation passed")
            data = serializer.validated_data.get('code', None)
            
            if data:
                print("Code data:", data)  # 'code' 값 출력
                return Response(data, status=status.HTTP_200_OK)
            else:
                print("Code is missing or invalid")
                return Response({"error": "Code not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Validation failed")
            print("Errors:", serializer.errors)  # 오류 출력
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
