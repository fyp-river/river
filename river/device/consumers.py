import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from device.utils import save_sensor_data


# --- WebSocket Consumer: Device to Backend ---
class DeviceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_name = self.scope['url_route']['kwargs']['device_name']
        self.group_name = f'device_{self.device_name.lower()}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Notify successful connection
        await self.send(text_data=json.dumps({
            'type': 'heartbeat',
            'data': f'Device {self.device_name} is connected'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Save incoming sensor data to the database
        await sync_to_async(save_sensor_data)(self.device_name, data)

        # Broadcast to frontend dashboard
        await self.channel_layer.group_send(
            "sensors",
            {
                "type": "send.sensor.data",
                "data": {
                    "device": self.device_name,
                    "payload": data
                }
            }
        )

        # Optional ack
        await self.send(text_data=json.dumps({"status": "received"}))

    async def send_device_data(self, event):
        await self.send(text_data=json.dumps(event["data"]))


# --- WebSocket Consumer: Dashboard Frontend ---
class SensorDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("sensors", self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "heartbeat",
            "data": "Sensor dashboard connected"
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sensors", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Dashboard received:", data)  # Optional for debugging

    async def send_sensor_data(self, event):
        await self.send(text_data=json.dumps(event["data"]))
