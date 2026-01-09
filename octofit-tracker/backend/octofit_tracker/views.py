"""
Views for testing error handling
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    ValidationError, NotAuthenticated, AuthenticationFailed,
    PermissionDenied, NotFound
)


@api_view(['GET'])
def test_validation_error(request):
    """Test validation error handling"""
    raise ValidationError("The data format is invalid")


@api_view(['GET'])
def test_authentication_error(request):
    """Test authentication error handling"""
    raise NotAuthenticated()


@api_view(['GET'])
def test_permission_error(request):
    """Test permission denied error handling"""
    raise PermissionDenied()


@api_view(['GET'])
def test_not_found_error(request):
    """Test not found error handling"""
    raise NotFound()


@api_view(['GET'])
def test_server_error(request):
    """Test server error handling"""
    raise Exception("Simulated server error")
