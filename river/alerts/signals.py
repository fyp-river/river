from django.db.models.signals import post_save
from django.dispatch import receiver
from device.models import SensorReading
from .utils import check_for_alerts
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save


@receiver(post_save, sender=SensorReading)
def handle_sensor_reading(sender, instance, created, **kwargs):
    if created:
        check_for_alerts(instance)

def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)