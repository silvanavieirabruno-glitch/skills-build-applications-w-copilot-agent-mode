/**
 * API utility for making HTTP requests with user-friendly error handling
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Extract user-friendly error message from API response
 */
const extractErrorMessage = async (response) => {
  try {
    const data = await response.json();
    
    // If backend provides structured error response
    if (data.message) {
      return {
        message: data.message,
        details: data.details || null
      };
    }
    
    // If backend provides detail field (Django REST Framework default)
    if (data.detail) {
      return {
        message: typeof data.detail === 'string' ? data.detail : 'An error occurred',
        details: typeof data.detail === 'object' ? data.detail : null
      };
    }
    
    // Fallback to generic message
    return {
      message: 'An error occurred while processing your request',
      details: data
    };
  } catch (e) {
    // If response is not JSON, return generic message
    return {
      message: `Server error: ${response.statusText || 'Unknown error'}`,
      details: null
    };
  }
};

/**
 * Get user-friendly message for network errors
 */
const getNetworkErrorMessage = (error) => {
  if (error.message === 'Failed to fetch') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  if (error.message.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }
  
  return 'A network error occurred. Please check your connection and try again.';
};

/**
 * Make an API request with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data or throws ApiError
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle successful responses
    if (response.ok) {
      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    }
    
    // Handle error responses
    const errorData = await extractErrorMessage(response);
    
    throw new ApiError(
      errorData.message,
      response.status,
      errorData.details
    );
    
  } catch (error) {
    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    const message = getNetworkErrorMessage(error);
    throw new ApiError(message, 0, null);
  }
};

/**
 * Convenience methods for different HTTP verbs
 */
const api = {
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'GET' });
  },
  
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  patch: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
  }
};

export default api;
export { ApiError };
