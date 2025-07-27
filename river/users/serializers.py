from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
