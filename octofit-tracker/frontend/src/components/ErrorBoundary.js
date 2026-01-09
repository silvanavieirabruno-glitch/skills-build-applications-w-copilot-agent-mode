import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors in React component tree
 * Displays user-friendly error message instead of crashing the entire app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Reload the page to recover from error
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Oops! Something Went Wrong
                  </h4>
                </div>
                <div className="card-body">
                  <p className="lead">
                    We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
                  </p>
                  <p className="mb-4">
                    You can try reloading the page or going back to the home page.
                  </p>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary" 
                      onClick={this.handleReload}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reload Page
                    </button>
                    <a 
                      href="/" 
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Go to Home
                    </a>
                  </div>

                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="mt-4">
                      <details className="mt-3">
                        <summary className="btn btn-sm btn-outline-danger">
                          Show Error Details (Development Only)
                        </summary>
                        <div className="mt-3 p-3 bg-light border rounded">
                          <h6>Error:</h6>
                          <pre className="text-danger small">
                            {this.state.error.toString()}
                          </pre>
                          {this.state.errorInfo && (
                            <>
                              <h6 className="mt-3">Component Stack:</h6>
                              <pre className="text-muted small" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                {this.state.errorInfo.componentStack}
                              </pre>
                            </>
                          )}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
