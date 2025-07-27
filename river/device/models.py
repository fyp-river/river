from django.db import models


# --- Device Model ---
class Device(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# --- Sensor Model ---
class Sensor(models.Model):
    SENSOR_TYPES = [
        ('TEMP', 'Temperature'),
        ('PH', 'pH'),
        ('TURB', 'Turbidity'),
        ('DO', 'Dissolved Oxygen'),
        ('ISE', 'Ion-Selective Electrode'),
        ('TDS', 'Total Dissolved Solids'),
        ('ORP', 'Oxidation-Reduction Potential'),
        ('EC', 'Electrical Conductivity'),
    ]

    name = models.CharField(max_length=100)
    sensor_type = models.CharField(max_length=10, choices=SENSOR_TYPES)
    is_active = models.BooleanField(default=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='sensors', null=True, blank=True)

    def __str__(self):
        return self.name


# --- SensorReading Model ---
class SensorReading(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='readings')
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='readings')

    timestamp = models.DateTimeField(auto_now_add=True)
    manual_override = models.BooleanField(default=False)

    # Optional fields
    pH = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    turbidity = models.FloatField(null=True, blank=True)
    dissolved_oxygen = models.FloatField(null=True, blank=True)
    ise = models.FloatField(null=True, blank=True)
    tds = models.FloatField(null=True, blank=True)
    orp = models.FloatField(null=True, blank=True)
    ec = models.FloatField(null=True, blank=True)

    value = models.FloatField(null=True, blank=True)  # for generic sensors

    def __str__(self):
        return f"{self.sensor.name or 'Sensor'} @ {self.timestamp}"


# --- MQTT Broker Model ---
class MQTTBroker(models.Model):
    name = models.CharField(max_length=100)
    host = models.CharField(max_length=100)
    port = models.IntegerField(default=1883)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    use_tls = models.BooleanField(default=False)
    tls_cert = models.FileField(upload_to='certs/', blank=True, null=True)

    is_active = models.BooleanField(default=False)
    last_health_check = models.DateTimeField(blank=True, null=True)
    is_healthy = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.host}:{self.port})"
