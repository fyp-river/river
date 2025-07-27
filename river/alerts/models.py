from django.db import models

class Alert(models.Model):
    device = models.ForeignKey('device.Device', on_delete=models.CASCADE)
    reading = models.ForeignKey('device.SensorReading', on_delete=models.CASCADE)
    parameter = models.CharField(max_length=50)  # e.g., "temperature"
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.parameter} alert on {self.device.name}"
