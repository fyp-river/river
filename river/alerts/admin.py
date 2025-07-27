from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['device', 'parameter', 'message', 'created_at', 'is_resolved']
    list_filter = ['parameter', 'is_resolved']
    search_fields = ['message', 'device__name']
