from rest_framework import serializers
from device.models import Device, Sensor, SensorReading, MQTTBroker


# --- SENSOR SERIALIZER ---
class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'


# --- SENSOR READING SERIALIZER ---
class SensorReadingSerializer(serializers.ModelSerializer):
    sensor = serializers.StringRelatedField()
    device = serializers.StringRelatedField()

    class Meta:
        model = SensorReading
        fields = '__all__'


# --- DEVICE SERIALIZER ---
class DeviceSerializer(serializers.ModelSerializer):
    sensors = SensorSerializer(many=True, read_only=True)

    class Meta:
        model = Device
        fields = ['id', 'name', 'location', 'is_online', 'description', 'created_at', 'sensors']


# --- MQTT BROKER SERIALIZER ---
class MQTTBrokerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MQTTBroker
        fields = '__all__'
