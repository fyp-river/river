from channels.generic.websocket import AsyncWebsocketConsumer
import json

class MapConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("map_updates", self.channel_name)
        await self.accept()
        print("[WebSocket Connected] maps")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("map_updates", self.channel_name)
        print("[WebSocket Disconnected] maps")

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("[MapConsumer] Received:", data)
        # Optionally broadcast the message to the group
        await self.channel_layer.group_send(
            "map_updates",
            {
                "type": "send_position",
                "message": data
            }
        )

    async def send_position(self, event):
        await self.send(text_data=json.dumps(event["message"]))
