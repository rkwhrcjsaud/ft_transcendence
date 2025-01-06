from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Friend
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class AddFriend(generics.GenericAPIView):
    premission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        friend_id = request.data.get('friend_id')
        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if friend.objects.filter(user=request.user, friend=friend).exists():
            return Response({'message': 'Already friends'}, status=status.HTTP_400_BAD_REQUEST)
        Friend.objects.create(user=request.user, friend=friend)
        return Response({'message': 'Friend added'}, status=status.HTTP_201_CREATED)
    
class RemoveFriend(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        friend_id = request.data.get('friend_id')
        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if not friend.objects.filter(user=request.user, friend=friend).exists():
            return Response({'message': 'Not friends'}, status=status.HTTP_400_BAD_REQUEST)
        Friend.objects.get(user=request.user, friend=friend).delete()
        return Response({'message': 'Friend removed'}, status=status.HTTP_200_OK)
    
class FriendList(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        friends = Friend.objects.filter(user=request.user).values_list('friend_id', flat=True)
        User = get_user_model()
        all_users = User.objects.all()
        user_list = []
        for user in all_users:
            if user.id == request.user.id:
                continue
            user_list.append({
                'id': user.id,
                'name': user.username,
                'status': user.is_active,
                'avatar': user.userprofile.profile_image.url if user.userprofile.profile_image else "/default_profile.jpeg",
                'isFriend': user.id in friends,
            })
        return Response({'users': user_list}, status=status.HTTP_200_OK)
        