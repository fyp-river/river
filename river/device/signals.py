from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import SensorReading
from .serializers import SensorReadingSerializer


# --- Manual Override Broadcast ---

@receiver(post_save, sender=SensorReading)
def broadcast_manual_override_reading(sender, instance, created, **kwargs):
    if instance.manual_override:
        channel_layer = get_channel_layer()
        group_name = f'device_{instance.device.name.lower()}'

        data = {
            'type': 'sensor.update',
            'device': instance.device.name,
            'manual_override': True,
            'timestamp': instance.timestamp.isoformat(),
            'pH': instance.pH,
            'temperature': instance.temperature,
            'turbidity': instance.turbidity,
            'dissolved_oxygen': instance.dissolved_oxygen,
            'ise': instance.ise,
            'tds': instance.tds,
            'orp': instance.orp,
            'ec': instance.ec,
        }

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'sensor_message',
                'data': data
            }
        )


# --- Normal Reading Broadcast (e.g., MQTT, WebSocket) ---

def broadcast_sensor_reading(reading):
    serializer = SensorReadingSerializer(reading)
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "sensors",
        {
            "type": "send_sensor_data",
            "data": serializer.data
        }
    )
