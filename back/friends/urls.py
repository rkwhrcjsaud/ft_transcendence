from django.urls import path, include
from .views import AddFriend, RemoveFriend, FriendList
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers


router = routers.DefaultRouter()

urlpatterns = [
    path('add/', AddFriend.as_view(), name='add'),
    path('remove/', RemoveFriend.as_view(), name='remove'),
    path('list/', FriendList.as_view(), name='list'),
    path('', include(router.urls)),
]