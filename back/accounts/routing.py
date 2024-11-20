from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/accounts/', consumers.AccountsConsumer.as_asgi()),
]