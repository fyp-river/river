# users/permissions.py
from rest_framework.permissions import BasePermission

# Role-based permission generator
def HasRole(required_role):
    class RolePermission(BasePermission):
        def has_permission(self, request, view):
            return (
                request.user.is_authenticated and 
                hasattr(request.user, 'userprofile') and 
                request.user.userprofile.role == required_role
            )
    return RolePermission


# Static permission class for admin role
class IsAdminUserRole(BasePermission):
    """
    Allows access only to users with role 'admin'.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'userprofile') and 
            request.user.userprofile.role == 'admin'
        )
