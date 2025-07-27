from django.db import models

class SensorPosition(models.Model):
    sensor_id = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sensor_id} at ({self.latitude}, {self.longitude})"
