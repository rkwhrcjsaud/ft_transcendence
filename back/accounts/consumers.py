import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import sync_to_async

class OnlineUsersConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket을 통해 온라인 사용자 정보를 관리하는 Consumer.
    """
    async def connect(self):
        """
        클라이언트가 WebSocket에 연결 요청 시 실행.
        WebSocket 연결을 허용하고 해당 채널을 그룹에 추가.
        """
        await self.channel_layer.group_add("online_users", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """
        WebSocket 연결이 끊어질 때 실행.
        해당 채널을 그룹에서 제거.
        """
        await self.channel_layer.group_discard("online_users", self.channel_name)

    async def user_online(self, event):
        """
        다른 사용자가 온라인 상태가 되었음을 알림.
        """
        await self.send_json(event)

    async def user_offline(self, event):
        """
        다른 사용자가 오프라인 상태가 되었음을 알림.
        """
        await self.send_json(event)

    async def receive_json(self, content):
        """
        클라이언트로부터 JSON 메시지를 수신할 때 실행.
        현재는 아무 동작도 하지 않음.
        """
        pass