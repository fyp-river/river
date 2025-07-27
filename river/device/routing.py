from django.urls import re_path
from .consumers import DeviceConsumer, SensorDataConsumer

websocket_urlpatterns = [
    # WebSocket for individual device updates
    re_path(r'^ws/device/(?P<device_name>\w+)/$', DeviceConsumer.as_asgi()),

    # WebSocket for real-time dashboard updates
    re_path(r'^ws/sensors/$', SensorDataConsumer.as_asgi()),
]
