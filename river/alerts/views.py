from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .models import Alert
from .serializers import AlertSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status





class UnresolvedAlertListAPIView(generics.ListAPIView):
    queryset = Alert.objects.filter(is_resolved=False).order_by('-created_at')
    serializer_class = AlertSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['device', 'parameter']  # Enables filtering via URL query params


class MarkAlertResolvedAPIView(APIView):
    def patch(self, request, pk):
        try:
            alert = Alert.objects.get(pk=pk)
            alert.is_resolved = True
            alert.save()
            return Response({'status': 'resolved'}, status=status.HTTP_200_OK)
        except Alert.DoesNotExist:
            return Response({'error': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)