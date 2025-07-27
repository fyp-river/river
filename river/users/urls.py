from django.urls import path
from django.contrib.auth import views as auth_views

from .views import CustomAuthToken, AdminOnlyAPI

urlpatterns = [
    # Token-based login
    path('login/', CustomAuthToken.as_view(), name='api_token_auth'),

    # Admin-only protected route
    path('admin-only/', AdminOnlyAPI.as_view(), name='admin-only'),

    # Password change
    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    # Password reset
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
