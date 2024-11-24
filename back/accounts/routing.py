from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/online-status/', consumers.OnlineUsersConsumer.as_asgi()),
]