import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Import WebSocket routes
from device.routing import websocket_urlpatterns as device_ws
from maps.routing import websocket_urlpatterns as maps_ws

# Set the default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'river.settings')

# Setup Django
django.setup()

# Get default Django ASGI application
django_asgi_app = get_asgi_application()

# Combine all WebSocket routes
websocket_routes = device_ws + maps_ws

# Define the ASGI application
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_routes)
    ),
})


#async def connect(self):
#    user = self.scope["user"]
#    if user.is_authenticated:
#        await self.channel_layer.group_add("maps", self.channel_name) # type: ignore
#        await self.accept()
#    else:
#        await self.close()
