"""
URL configuration for river project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from device import views  
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'api/sensors', views.SensorReadingViewSet, basename='sensorreading')
router.register(r'api/devices', views.DeviceViewSet, basename='device')
router.register(r'api/mqtt-brokers', views.MQTTBrokerViewSet, basename='mqttbroker')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('device.urls')),
    path('api/alerts/', include('alerts.urls')),
    path('api/users/', include('users.urls')),
    path('map/', include('maps.urls')),
    path('api/schema/sensor-reading/', views.get_sensor_schema, name='sensor_schema'), 
]

# Include the router URLs
urlpatterns += router.urls