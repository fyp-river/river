from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['id', 'device', 'parameter', 'message', 'created_at', 'is_resolved']
