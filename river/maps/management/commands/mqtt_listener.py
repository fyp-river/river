from django.core.management.base import BaseCommand
from maps.mqtt_client import start_mqtt

class Command(BaseCommand):
    help = 'Starts the MQTT listener'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Starting MQTT listener..."))
        start_mqtt()
