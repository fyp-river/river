from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import sensors.routing  # this should contain ws routing

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            sensors.routing.websocket_urlpatterns
        )
    ),
})
