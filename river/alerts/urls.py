from django.urls import path
from .views import UnresolvedAlertListAPIView,  MarkAlertResolvedAPIView

urlpatterns = [
    path('unresolved/', UnresolvedAlertListAPIView.as_view(), name='unresolved-alerts'),
 path('<int:pk>/resolve/', MarkAlertResolvedAPIView.as_view(), name='resolve-alert'),
]

# This code defines the URL routing for the alerts app, specifically for listing unresolved alerts.
# The `UnresolvedAlertListAPIView` view handles the retrieval of unresolved alerts.