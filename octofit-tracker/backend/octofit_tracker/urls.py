"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.views.defaults import page_not_found, server_error, bad_request, permission_denied
import os
from . import views

# Custom error handlers
def custom_404(request, exception):
    """Handle 404 errors with user-friendly message"""
    return JsonResponse({
        'error': 'Not Found',
        'message': 'The page or resource you requested could not be found. Please check the URL and try again.',
        'status': 404
    }, status=404)

def custom_500(request):
    """Handle 500 errors with user-friendly message"""
    return JsonResponse({
        'error': 'Server Error',
        'message': 'Something went wrong on our end. We are working to fix it. Please try again later.',
        'status': 500
    }, status=500)

def custom_400(request, exception):
    """Handle 400 errors with user-friendly message"""
    return JsonResponse({
        'error': 'Bad Request',
        'message': 'Your request could not be processed. Please check your input and try again.',
        'status': 400
    }, status=400)

def custom_403(request, exception):
    """Handle 403 errors with user-friendly message"""
    return JsonResponse({
        'error': 'Forbidden',
        'message': 'You do not have permission to access this resource. If you believe this is an error, please contact support.',
        'status': 403
    }, status=403)

def api_root(request):
    """API root endpoint"""
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    
    return JsonResponse({
        'message': 'Welcome to OctoFit Tracker API',
        'version': '1.0',
        'endpoints': {
            'admin': f'{base_url}/admin/',
            'api': f'{base_url}/api/',
            'test_errors': {
                'validation': f'{base_url}/test/validation-error/',
                'authentication': f'{base_url}/test/authentication-error/',
                'permission': f'{base_url}/test/permission-error/',
                'not_found': f'{base_url}/test/not-found-error/',
                'server': f'{base_url}/test/server-error/',
            }
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    # Test error endpoints
    path('test/validation-error/', views.test_validation_error, name='test-validation-error'),
    path('test/authentication-error/', views.test_authentication_error, name='test-authentication-error'),
    path('test/permission-error/', views.test_permission_error, name='test-permission-error'),
    path('test/not-found-error/', views.test_not_found_error, name='test-not-found-error'),
    path('test/server-error/', views.test_server_error, name='test-server-error'),
]

# Custom error handlers
handler404 = custom_404
handler500 = custom_500
handler400 = custom_400
handler403 = custom_403
