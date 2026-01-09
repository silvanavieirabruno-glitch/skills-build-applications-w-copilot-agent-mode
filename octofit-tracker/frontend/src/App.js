import React, { useState } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorMessage from './components/ErrorMessage';
import api from './utils/api';

function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Test API connection
  const testApiConnection = async () => {
    setError(null);
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await api.get('/');
      setApiResponse(response);
    } catch (err) {
      setError({
        message: err.message,
        details: err.details
      });
    } finally {
      setLoading(false);
    }
  };

  // Test 404 error
  const test404Error = async () => {
    setError(null);
    setLoading(true);
    setApiResponse(null);
    
    try {
      await api.get('/api/nonexistent');
    } catch (err) {
      setError({
        message: err.message,
        details: err.details
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="text-center mb-5">
              <h1 className="display-4">
                <i className="bi bi-heart-pulse text-danger me-3"></i>
                OctoFit Tracker
              </h1>
              <p className="lead text-muted">
                Fitness tracking with user-friendly error handling
              </p>
            </div>

            {error && (
              <ErrorMessage
                message={error.message}
                type="error"
                title="Error"
                details={error.details}
                dismissible={true}
                onClose={() => setError(null)}
              />
            )}

            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-shield-check me-2"></i>
                  Error Handling Demo
                </h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  This application demonstrates user-friendly error handling for common scenarios:
                </p>
                
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Network connection errors
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    API endpoint not found (404)
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Server errors (500)
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Validation errors
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Authentication errors
                  </li>
                </ul>

                <h6 className="mb-3">Test Error Handling:</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-primary"
                    onClick={testApiConnection}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Testing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-server me-2"></i>
                        Test API Connection
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-warning"
                    onClick={test404Error}
                    disabled={loading}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Test 404 Error
                  </button>
                </div>

                {apiResponse && (
                  <div className="alert alert-success mt-4">
                    <h6 className="alert-heading">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      API Response:
                    </h6>
                    <pre className="mb-0 small">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow mt-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  About Error Handling
                </h5>
              </div>
              <div className="card-body">
                <h6>Backend Error Handling:</h6>
                <ul>
                  <li>Custom exception handler in Django REST Framework</li>
                  <li>User-friendly messages for all HTTP error codes</li>
                  <li>Structured error responses with details</li>
                  <li>Database connection error handling</li>
                </ul>

                <h6 className="mt-3">Frontend Error Handling:</h6>
                <ul>
                  <li>Error Boundary to catch React component errors</li>
                  <li>API utility with network error handling</li>
                  <li>Reusable ErrorMessage component</li>
                  <li>Clear, actionable error messages for users</li>
                </ul>

                <div className="alert alert-light border mt-3">
                  <small className="text-muted">
                    <strong>Note:</strong> All errors are logged for debugging while displaying 
                    user-friendly messages to end users. See the ERROR_HANDLING.md file for 
                    complete documentation.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
