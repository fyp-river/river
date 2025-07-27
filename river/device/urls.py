from django.urls import path, include
from rest_framework.routers import DefaultRouter
from device.views import (
    DeviceViewSet,
    SensorReadingViewSet,
    MQTTBrokerViewSet,
    set_active_broker,
    toggle_manual_mode,
    get_sensor_schema
)

# REST API Router setup
router = DefaultRouter()
router.register(r'devices', DeviceViewSet)
router.register(r'sensor-readings', SensorReadingViewSet)
router.register(r'mqtt-brokers', MQTTBrokerViewSet)

urlpatterns = [
    # Main API routes
    path('api/', include(router.urls)),

    # Custom API endpoint for dynamic Sensor schema
    path('api/sensors/schema/', get_sensor_schema, name='sensor-schema'),

    # Admin endpoints for broker and manual mode toggle
    path('admin/set-active-broker/<int:broker_id>/', set_active_broker, name='set-active-broker'),
    path('admin/toggle-manual-mode/<int:pk>/', toggle_manual_mode, name='toggle-manual-mode'),
]
