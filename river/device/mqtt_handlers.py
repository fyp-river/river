import json
from .models import Device, SensorReading
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def on_connect(client, userdata, flags, rc):
    print(f"[MQTT] Connected with code {rc}")
    client.subscribe("devices/+/data")
    client.subscribe("devices/+/status")

def on_message(client, userdata, msg):
    topic_parts = msg.topic.split('/')
    device_name = topic_parts[1]

    if 'data' in msg.topic:
        payload = json.loads(msg.payload.decode())
        device, _ = Device.objects.get_or_create(name=device_name)

        SensorReading.objects.create(
            device=device,
            pH=payload.get("pH"),
            temperature=payload.get("temperature"),
            turbidity=payload.get("turbidity"),
            dissolved_oxygen=payload.get("dissolved_oxygen")
        )

        device.is_online = True
        device.save()

        # Broadcast to WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"device_{device_name}",
            {
                "type": "send_sensor_data",
                "data": payload
            }
        )

    elif 'status' in msg.topic:
        status = msg.payload.decode()
        device, _ = Device.objects.get_or_create(name=device_name)
        device.is_online = (status == "online")
        device.save()
