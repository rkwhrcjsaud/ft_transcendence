from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/localgame/(?P<username>\w+)/$', consumers.PongConsumer.as_asgi()),
]