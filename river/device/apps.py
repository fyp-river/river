from django.apps import AppConfig
# from .mqtt_client import run_mqtt

class DeviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'device'

    def ready(self):
#       from .mqtt_client import run_mqtt
#        run_mqtt()
        pass
        # Ensure the MQTT client starts when the app is ready
        # This will run the MQTT client in a separate thread
