"""
Utility functions for OctoFit Tracker backend
Provides custom exception handling for user-friendly error messages
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework.exceptions import (
    ValidationError,
    PermissionDenied,
    NotAuthenticated,
    AuthenticationFailed,
    NotFound,
)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides user-friendly error messages
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If response is None, handle Django core exceptions
    if response is None:
        if isinstance(exc, DjangoValidationError):
            return Response({
                'error': 'Validation Error',
                'message': 'The data you provided is invalid. Please check your input and try again.',
                'details': exc.messages if hasattr(exc, 'messages') else str(exc)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(exc, Http404):
            return Response({
                'error': 'Not Found',
                'message': 'The resource you requested could not be found. Please check the URL and try again.',
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Handle database connection errors
        if 'ServerSelectionTimeoutError' in str(type(exc)):
            return Response({
                'error': 'Database Connection Error',
                'message': 'We are having trouble connecting to our database. Please try again in a few moments.',
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Generic server error
        return Response({
            'error': 'Server Error',
            'message': 'Something went wrong on our end. We are working to fix it. Please try again later.',
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Customize responses for REST framework exceptions
    error_data = {
        'error': exc.__class__.__name__,
        'message': get_user_friendly_message(exc),
    }

    # Include field-specific errors if available
    if hasattr(response, 'data') and isinstance(response.data, dict):
        if 'detail' not in response.data:
            error_data['details'] = response.data
        else:
            # If there's just a detail message, include it
            if isinstance(response.data['detail'], str):
                error_data['details'] = response.data['detail']
    
    response.data = error_data
    return response


def get_user_friendly_message(exc):
    """
    Convert exception types to user-friendly messages
    """
    error_messages = {
        ValidationError: 'The information you provided is not valid. Please check your input and try again.',
        NotAuthenticated: 'You need to be logged in to access this resource. Please sign in and try again.',
        AuthenticationFailed: 'Your login credentials are incorrect. Please check your username and password.',
        PermissionDenied: 'You do not have permission to access this resource. If you believe this is an error, please contact support.',
        NotFound: 'The resource you requested could not be found. Please check the URL and try again.',
    }
    
    # Get the appropriate message based on exception type
    for exc_type, message in error_messages.items():
        if isinstance(exc, exc_type):
            return message
    
    # Default message if no specific match
    return 'An error occurred while processing your request. Please try again.'


def get_error_response(message, status_code=status.HTTP_400_BAD_REQUEST, error_type='Error', details=None):
    """
    Helper function to create consistent error responses
    """
    error_data = {
        'error': error_type,
        'message': message,
    }
    
    if details:
        error_data['details'] = details
    
    return Response(error_data, status=status_code)
