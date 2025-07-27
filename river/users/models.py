# users/models.py
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

