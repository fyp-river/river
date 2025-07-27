
from django.utils import timezone


def save_sensor_data(data):
    from device.models import Device, SensorType, Sensor, SensorReading
    device, _ = Device.objects.get_or_create(name=device_name)
    for sensor_key, value in payload.items():
        sensor_type, _ = SensorType.objects.get_or_create(name=sensor_key)
        sensor, _ = Sensor.objects.get_or_create(device=device, sensor_type=sensor_type)
        SensorReading.objects.create(sensor=sensor, value=value, timestamp=timezone.now())
