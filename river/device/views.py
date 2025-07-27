from rest_framework import viewsets
from django.shortcuts import redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.apps import apps

from device.models import Device, SensorReading, MQTTBroker
from device.serializers import (
    DeviceSerializer,
    SensorReadingSerializer,
    MQTTBrokerSerializer
)


# --- REST API ViewSets ---

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class SensorReadingViewSet(viewsets.ModelViewSet):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer


class MQTTBrokerViewSet(viewsets.ModelViewSet):
    queryset = MQTTBroker.objects.all()
    serializer_class = MQTTBrokerSerializer


# --- Admin Actions ---

@staff_member_required
def set_active_broker(request, broker_id):
    MQTTBroker.objects.all().update(is_active=False)
    MQTTBroker.objects.filter(id=broker_id).update(is_active=True)
    return redirect("/admin/device/mqttbroker/")


@staff_member_required
def toggle_manual_mode(request, pk):
    reading = get_object_or_404(SensorReading, pk=pk)
    reading.manual_override = not reading.manual_override
    reading.save()
    return redirect(request.META.get('HTTP_REFERER', '/admin/'))


# --- Dynamic Schema Sync Endpoint for Frontend ---

def get_sensor_schema(request):
    Sensor = apps.get_model('device', 'Sensor')
    fields = []

    for field in Sensor._meta.get_fields():
        # Skip reverse and many-to-many fields
        if field.auto_created and not field.concrete:
            continue
        if field.many_to_many:
            continue

        field_info = {
            "name": field.name,
            "type": field.get_internal_type(),
            "required": not field.null if hasattr(field, 'null') else True,
        }

        # ForeignKey relationship info
        if field.is_relation and field.related_model:
            field_info["type"] = "ForeignKey"
            field_info["related_model"] = field.related_model.__name__

        # Optional field metadata
        if hasattr(field, 'max_length') and field.max_length:
            field_info["max_length"] = field.max_length
        if getattr(field, 'auto_now', False):
            field_info["auto_now"] = True
        if getattr(field, 'auto_now_add', False):
            field_info["auto_now_add"] = True

        fields.append(field_info)

    return JsonResponse({
        "model": "Sensor",
        "fields": fields
    }, json_dumps_params={"indent": 2})
