from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from users.permissions import HasRole, IsAdminUserRole

# Only users with role 'viewer' can access this view
class ViewerOnlyAPI(APIView):
    permission_classes = [HasRole('viewer')]

    def get(self, request):
        return Response({'message': 'Viewer access granted'})


# Only users with role 'admin' can access this view
class AdminOnlyAPI(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        return Response({'message': 'Admin access granted'})


# All authenticated users can access this
class GeneralUserAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello, {request.user.username}!'})


# Custom token auth endpoint
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'role': getattr(user, 'userprofile', None).role if hasattr(user, 'userprofile') else None
        })
