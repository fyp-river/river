from django.apps import AppConfig

class DeviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'device'

    def ready(self):
        # Start the MQTT client when the app is ready
        # This will run the MQTT client in a separate thread
        try:
            from .mqtt_client import start_mqtt
            start_mqtt()
            print("[Device App] ✅ MQTT client started successfully")
        except Exception as e:
            print(f"[Device App] ❌ Failed to start MQTT client: {e}")
