import React, { useState, useEffect, useRef } from 'react';

const TripStatusEdit = ({ 
  currentStatus, 
  onStatusChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('TripStatusEdit props:', { 
      currentStatus, 
      onStatusChangeType: typeof onStatusChange 
    });
  }, [currentStatus, onStatusChange]);

  // Status configurations with colors and labels
  const statusOptions = [
    { 
      value: 'Confirmado', 
      color: 'text-success', 
      bgColor: 'bg-success', 
      label: 'Confirmado' 
    },
    { 
      value: 'Pendiente', 
      color: 'text-warning', 
      bgColor: 'bg-warning', 
      label: 'Pendiente' 
    },
    { 
      value: 'Cancelado', 
      color: 'text-danger', 
      bgColor: 'bg-danger', 
      label: 'Cancelado' 
    }
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Find current status configuration
  const currentStatusConfig = statusOptions.find(
    status => status.value.toLowerCase() === currentStatus?.toLowerCase()
  ) || statusOptions[1]; // Default to Pendiente if not found

  const handleStatusSelect = (status) => {
    console.log('Attempting to change status:', {
      status: status.value,
      onStatusChangeType: typeof onStatusChange,
      onStatusChange
    });

    // Fallback error handling
    if (!onStatusChange) {
      console.error('onStatusChange is not provided');
      return;
    }

    // Try calling the function
    try {
      onStatusChange(status.value);
    } catch (error) {
      console.error('Error calling onStatusChange:', error);
    }

    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`position-relative ${className}`} 
      style={{ cursor: 'pointer' }}
    >
      {/* Current Status Display */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`d-inline-block px-2 py-1 rounded ${currentStatusConfig.color} ${currentStatusConfig.bgColor} bg-opacity-10`}
      >
        {currentStatus || 'Seleccionar Estado'}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="position-absolute z-3 mt-1 shadow-sm rounded"
          style={{ 
            minWidth: '120px', 
            backgroundColor: 'white', 
            border: '1px solid #dee2e6' 
          }}
        >
          {statusOptions.map((status) => (
            <div
              key={status.value}
              onClick={() => handleStatusSelect(status)}
              className={`px-3 py-2 ${status.color} hover-bg-light d-flex align-items-center`}
              style={{ 
                cursor: 'pointer',
                backgroundColor: currentStatus === status.value ? 'rgba(0,0,0,0.05)' : 'transparent'
              }}
            >
              <span 
                className={`me-2 d-inline-block rounded-circle ${status.bgColor}`} 
                style={{ 
                  width: '10px', 
                  height: '10px' 
                }}
              ></span>
              {status.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripStatusEdit;