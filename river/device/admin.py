from django.contrib import admin
from django import forms
from django.urls import reverse
from django.utils.html import format_html

from .models import Device, Sensor, SensorReading, MQTTBroker


# --- Device Admin ---
@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'is_online', 'created_at']
    search_fields = ['name', 'location']
    readonly_fields = ['created_at']


# --- Sensor Admin ---
@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ['name', 'sensor_type', 'device', 'is_active']
    list_filter = ['sensor_type', 'is_active']
    search_fields = ['name']


# --- SensorReading Form with Slider UI ---
class SensorReadingForm(forms.ModelForm):
    class Meta:
        model = SensorReading
        fields = '__all__'
        widgets = {
            'manual_override': forms.Select(choices=[(False, 'MQTT Mode'), (True, 'Manual Mode')]),
            'pH': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 14, 'step': 0.1}),
            'temperature': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 100, 'step': 0.1}),
            'turbidity': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 1000, 'step': 1}),
            'dissolved_oxygen': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 20, 'step': 0.1}),
            'ise': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 1000, 'step': 1}),
            'tds': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 1000, 'step': 1}),
            'orp': forms.NumberInput(attrs={'type': 'range', 'min': -1000, 'max': 1000, 'step': 1}),
            'ec': forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 1000, 'step': 1}),
        }

    class Media:
        js = ('admin/manual_override_toggle.js',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and not self.instance.manual_override:
            for field in ['pH', 'temperature', 'turbidity', 'dissolved_oxygen', 'ise', 'tds', 'orp', 'ec']:
                if field in self.fields:
                    self.fields[field].disabled = True


# --- SensorReading Admin with Manual Toggle Link ---
@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    form = SensorReadingForm
    list_display = [
        'sensor', 'timestamp', 'manual_override', 'pH', 'temperature',
        'turbidity', 'dissolved_oxygen', 'ise', 'tds', 'orp', 'ec',
        'toggle_manual_override_link'
    ]
    list_filter = ['timestamp', 'manual_override']

    def toggle_manual_override_link(self, obj):
        url = reverse('toggle-manual-mode', args=[obj.pk])
        return format_html('<a href="{}">Toggle</a>', url)
    toggle_manual_override_link.short_description = 'Manual Override'


# --- MQTT Broker Admin with Activation Button ---
@admin.register(MQTTBroker)
class MQTTBrokerAdmin(admin.ModelAdmin):
    list_display = ['name', 'host', 'port', 'is_active', 'set_active_button']
    list_filter = ['is_active']
    search_fields = ['name', 'host']

    def set_active_button(self, obj):
        if obj.is_active:
            return "✅ Active"
        url = reverse('set-active-broker', args=[obj.pk])
        return format_html('<a class="button" href="{}">Set Active</a>', url)
    set_active_button.short_description = "Broker Control"
