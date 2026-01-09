import React, { useState } from 'react';

/**
 * ErrorMessage component for displaying user-friendly error messages
 * @param {string} message - The error message to display
 * @param {string} type - Type of alert (error, warning, info, success)
 * @param {string} title - Optional title for the error
 * @param {boolean} dismissible - Whether the alert can be dismissed
 * @param {function} onClose - Callback when alert is closed
 */
const ErrorMessage = ({ 
  message, 
  type = 'error', 
  title = null,
  dismissible = true,
  onClose = null,
  details = null
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getAlertClass = () => {
    const typeMap = {
      error: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info',
      success: 'alert-success'
    };
    return typeMap[type] || 'alert-danger';
  };

  const getIcon = () => {
    const iconMap = {
      error: 'bi-exclamation-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
      success: 'bi-check-circle-fill'
    };
    return iconMap[type] || 'bi-exclamation-circle-fill';
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div 
      className={`alert ${getAlertClass()} ${dismissible ? 'alert-dismissible' : ''} fade show`}
      role="alert"
    >
      <div className="d-flex align-items-start">
        <i className={`bi ${getIcon()} me-2 flex-shrink-0`} style={{ fontSize: '1.2rem' }}></i>
        <div className="flex-grow-1">
          {title && <h5 className="alert-heading mb-2">{title}</h5>}
          <div>{message}</div>
          {details && (
            <details className="mt-2">
              <summary className="btn btn-sm btn-outline-secondary" style={{ cursor: 'pointer' }}>
                Show Details
              </summary>
              <div className="mt-2 p-2 bg-light border rounded">
                <small className="text-muted">
                  {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
                </small>
              </div>
            </details>
          )}
        </div>
        {dismissible && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleClose}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
