from django.contrib import admin
from .models import UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']

admin.site.register(UserProfile, UserProfileAdmin)

def has_admin_permission(request):
    return request.user.userprofile.role == 'admin'
