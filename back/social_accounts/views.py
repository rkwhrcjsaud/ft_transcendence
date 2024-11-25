from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.generics import GenericAPIView
from django.conf import settings
from .serializers import Oauth42RegisterSerializer

# Create your views here.

class Oauth42RegisterView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = Oauth42RegisterSerializer

    # 프론트에서 인증코드를 받아서 42 API로부터 유저 정보를 받아옴
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = ((serializer.validated_data)['code'])
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
