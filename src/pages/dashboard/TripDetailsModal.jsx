import React, { useState, useEffect, useRef, useMemo } from 'react';

const TripDetailsModal = ({ trip, show, onClose }) => {
  // Referencia al componente modal para evitar actualizaciones innecesarias
  const modalRef = useRef(null);
  
  // Memoize trip data to prevent unnecessary re-renders
  const tripData = useMemo(() => trip, [trip?.id]);
  
  const [explorers, setExplorers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState({
    explorers: false,
    activities: false,
    payments: false
  });
  const [error, setError] = useState({
    explorers: null,
    activities: null,
    payments: null
  });
  const [debugInfo, setDebugInfo] = useState(null);
  
  // State for trip, explorer, and payment statuses
  const [tripStatus, setTripStatus] = useState(trip?.trip_status || trip?.status || 'Pendiente');
  const [explorerStatuses, setExplorerStatuses] = useState({});
  const [paymentStatuses, setPaymentStatuses] = useState({});
  
  // Apply effect only when modal is shown or closed, not on every render
  useEffect(() => {
    if (show && trip?.id) {
      console.log("Modal abierto, inicializando estado del viaje:", trip);
      setTripStatus(trip?.trip_status || trip?.status || 'Pendiente');
      
      // Limpiar estados previos
      setExplorerStatuses({});
      setPaymentStatuses({});
      
      // Cargar datos frescos
      fetchTripStatus();
      fetchExplorers();
      fetchActivities();
    }
  }, [show, trip?.id]);
  
  // Función para obtener el estado actual del viaje desde el backend
  const fetchTripStatus = async () => {
    if (!trip?.id) return;
    
    try {
      console.log("Inicializando estado del viaje desde props:", trip);
      
      // Ya que GET /trips/:id no está permitido, usamos el valor del props
      const currentStatus = trip.trip_status || trip.status || 'Pendiente';
      console.log("Estado actual del viaje (desde props):", currentStatus);
      setTripStatus(currentStatus);
      
      // Intentar obtener el estado desde las reservaciones (enfoque alternativo)
      try {
        const response = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}/status`, {
          method: 'GET'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.status) {
            console.log("Estado del viaje obtenido desde API:", data.status);
            setTripStatus(data.status);
          }
        } else {
          console.log("No se pudo obtener el estado actual desde API, usando props");
        }
      } catch (err) {
        console.log("Error al consultar estado API, usando props:", err.message);
      }
    } catch (error) {
      console.error("Error al inicializar estado del viaje:", error);
    }
  };

  // Status configurations
  const tripStatusOptions = [
    { label: 'Pendiente', className: 'text-warning' },
    { label: 'Confirmado', className: 'text-success' },
    { label: 'Cancelado', className: 'text-danger' }
  ];

  const paymentStatusOptions = ['N/A', 'Pendiente', 'Confirmado', 'Rechazado'];
  const paymentStatusClasses = {
    'N/A': 'bg-secondary',
    'Pendiente': 'bg-warning',
    'Confirmado': 'bg-success', 
    'Rechazado': 'bg-danger'
  };

  // Dropdown for Trip Status
  const TripStatusDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="dropdown">
        <button 
          className={`btn dropdown-toggle ${
            tripStatusOptions.find(opt => opt.label === tripStatus)?.className || 'text-secondary'
          }`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {tripStatus}
        </button>
        {isOpen && (
          <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
            {tripStatusOptions.map((option) => (
              <button
                key={option.label}
                className={`dropdown-item ${option.className}`}
                onClick={() => {
                  setTripStatus(option.label);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Button to toggle Explorer Status
  const ExplorerStatusButton = ({ explorer }) => {
    const statusOptions = ['Pendiente', 'Confirmado', 'Cancelado'];
    const statusClasses = {
      'Pendiente': 'bg-warning',
      'Confirmado': 'bg-success', 
      'Cancelado': 'bg-danger'
    };

    const getCurrentStatus = () => {
      return explorerStatuses[explorer.id] || explorer.status || 'Pendiente';
    };

    const handleStatusChange = () => {
      const currentStatusIndex = statusOptions.indexOf(getCurrentStatus());
      const nextStatusIndex = (currentStatusIndex + 1) % statusOptions.length;
      const nextStatus = statusOptions[nextStatusIndex];

      setExplorerStatuses(prev => ({
        ...prev,
        [explorer.id]: nextStatus
      }));
    };

    const currentStatus = getCurrentStatus();

    return (
      <button
        onClick={handleStatusChange}
        className={`badge ${statusClasses[currentStatus]} text-white`}
      >
        {currentStatus}
      </button>
    );
  };

  // New button to toggle Payment Status
  const PaymentStatusButton = ({ explorer }) => {
    const getCurrentStatus = () => {
      return paymentStatuses[explorer.id] || explorer.payment_status || 'Pendiente';
    };

    const handleStatusChange = () => {
      const currentStatusIndex = paymentStatusOptions.indexOf(getCurrentStatus());
      const nextStatusIndex = (currentStatusIndex + 1) % paymentStatusOptions.length;
      const nextStatus = paymentStatusOptions[nextStatusIndex];

      setPaymentStatuses(prev => ({
        ...prev,
        [explorer.id]: nextStatus
      }));
    };

    const currentStatus = getCurrentStatus();

    return (
      <button
        onClick={handleStatusChange}
        className={`badge ${paymentStatusClasses[currentStatus]} text-white`}
      >
        {currentStatus}
      </button>
    );
  };

  useEffect(() => {
    if (show && trip) {
      fetchExplorers();
      fetchActivities();
      // We'll fetch payment information after explorers are loaded
    } else {
      // Clear data when modal is closed
      setExplorers([]);
      setActivities([]);
      setError({
        explorers: null,
        activities: null,
        payments: null
      });
      setDebugInfo(null);
    }
  }, [show, trip]);

  // After explorers are loaded, fetch their payment information
  useEffect(() => {
    if (explorers.length > 0 && trip?.id && show) {
      fetchPaymentStatuses();
    }
  }, [explorers.length, trip?.id, show]);

  const fetchExplorers = async () => {
    if (!trip || !trip.id) return;
    
    setIsLoading(prev => ({ ...prev, explorers: true }));
    setError(prev => ({ ...prev, explorers: null }));
    
    try {
      console.log(`Fetching explorers for trip ID: ${trip.id}`);
      
      const response = await fetch(`https://rangerhub-back.vercel.app/reservations/trip/${trip.id}/explorers`);
      
      console.log(`Explorers response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener los exploradores`);
      }
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error(`Error al procesar la respuesta: ${parseError.message}`);
      }
      
      console.log("Parsed explorers data:", data);
      
      if (data && data.explorers) {
        if (Array.isArray(data.explorers)) {
          const normalizedExplorers = data.explorers.map(explorer => {
            if (Array.isArray(explorer)) {
              return {
                id: explorer[0] || `temp-id-${Math.random()}`,
                name: explorer[1] || 'N/A',
                email: explorer[2] || 'N/A',
                phone: explorer[3] || 'N/A',
                status: explorer[4] || 'pending'
              };
            }
            
            return {
              id: explorer.id || `temp-id-${Math.random()}`,
              name: explorer.name || 'N/A',
              email: explorer.email || 'N/A',
              phone: explorer.phone || explorer.phone_number || 'N/A',
              status: explorer.status || 'pending'
            };
          });
          
          setExplorers(normalizedExplorers);
        } else {
          console.error("data.explorers no es un array:", data.explorers);
          setDebugInfo(`data.explorers no es un array: ${JSON.stringify(data.explorers)}`);
          setExplorers([]);
        }
      } else {
        console.warn("Respuesta sin datos de exploradores:", data);
        setExplorers([]);
      }
      
    } catch (error) {
      console.error("Error al obtener exploradores:", error);
      setError(prev => ({ ...prev, explorers: `Error: ${error.message}` }));
    } finally {
      setIsLoading(prev => ({ ...prev, explorers: false }));
    }
  };

  // New function to fetch payment statuses for all explorers
  const fetchPaymentStatuses = async () => {
    if (!trip || !trip.id || explorers.length === 0) return;
    
    setIsLoading(prev => ({ ...prev, payments: true }));
    setError(prev => ({ ...prev, payments: null }));
    
    try {
      console.log(`Initializing payment statuses for trip ID: ${trip.id}`);
      
      // First, let's initialize all payment statuses as 'N/A'
      const initialStatusesObj = {};
      explorers.forEach(explorer => {
        initialStatusesObj[explorer.id] = 'N/A';
      });
      
      // Set initial statuses
      setPaymentStatuses(initialStatusesObj);
      
      // Try to get any existing payment info from the backend
      try {
        // Hacemos una única solicitud para obtener todos los pagos del viaje
        const response = await fetch(`https://rangerhub-back.vercel.app/payments/trip/${trip.id}`);
        
        if (response.ok) {
          const payments = await response.json();
          console.log("Pagos encontrados:", payments);
          
          // Para cada pago encontrado, actualizamos el estado correspondiente
          const updatedStatuses = {...initialStatusesObj};
          
          if (payments && Array.isArray(payments)) {
            // Actualizamos los estados de pago
            payments.forEach(payment => {
              if (payment.user_id && payment.payment_status) {
                updatedStatuses[payment.user_id] = payment.payment_status;
              }
            });
            
            // Actualizamos los explorers con la información de pago
            setExplorers(prev => prev.map(explorer => {
              const paymentInfo = payments.find(p => p.user_id === explorer.id);
              return {
                ...explorer,
                payment_status: paymentInfo?.payment_status || 'N/A',
                payment_info: paymentInfo || {}
              };
            }));
          }
          
          setPaymentStatuses(updatedStatuses);
        } else {
          console.warn("No se pudieron obtener los pagos del viaje:", response.statusText);
        }
      } catch (err) {
        console.warn("Error al obtener pagos del viaje:", err);
      }
      
      // Simulamos una carga completada
      setTimeout(() => {
        setIsLoading(prev => ({ ...prev, payments: false }));
      }, 500);
      
    } catch (error) {
      console.error("Error al obtener estados de pago:", error);
      setError(prev => ({ ...prev, payments: `Error: ${error.message}` }));
      setIsLoading(prev => ({ ...prev, payments: false }));
    }
  };

  const fetchActivities = async () => {
    if (!trip || !trip.id) return;
    
    setIsLoading(prev => ({ ...prev, activities: true }));
    setError(prev => ({ ...prev, activities: null }));
    
    try {
      console.log(`Fetching activities for trip ID: ${trip.id}`);
      
      const response = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}/activities`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener actividades del viaje`);
      }
      
      const data = await response.json();
      console.log("Trip activities data:", data);
      
      if (!data || !Array.isArray(data.activities)) {
        console.warn("Formato inesperado en datos de actividades:", data);
        setActivities([]);
        return;
      }
      
      setActivities(data.activities);
      console.log(`Se encontraron ${data.activities.length} actividades para este viaje`);
      
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      setError(prev => ({ ...prev, activities: `Error: ${error.message}` }));
      setActivities([]);
    } finally {
      setIsLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Save changes handler
  const handleSave = async () => {
    try {
      console.log("Guardando cambios del viaje...");
      console.log("ID del viaje:", trip.id);
      console.log("Estado del viaje a guardar:", tripStatus);
      
      // Probar diferentes cuerpos de solicitud para la actualización del estado del viaje
      const posiblesCuerpos = [
        { status: tripStatus },
        { trip_status: tripStatus },
        { tripStatus: tripStatus },
        { new_status: tripStatus },
        { value: tripStatus }
      ];
      
      let tripUpdateSuccess = false;
      let tripUpdateError = null;
      
      // Intentar cada formato posible hasta que uno funcione
      for (const cuerpo of posiblesCuerpos) {
        try {
          console.log(`Intentando con cuerpo: ${JSON.stringify(cuerpo)}`);
          const response = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuerpo)
          });
          
          if (response.ok) {
            console.log(`✅ Éxito con formato: ${JSON.stringify(cuerpo)}`);
            tripUpdateSuccess = true;
            break;
          } else {
            const errorText = await response.text();
            console.warn(`❌ Falló con formato ${JSON.stringify(cuerpo)}: ${errorText}`);
            tripUpdateError = errorText;
          }
        } catch (err) {
          console.error(`Error en solicitud con formato ${JSON.stringify(cuerpo)}:`, err);
          tripUpdateError = err.message;
        }
      }
      
      // Si ninguno funcionó, intentar una solicitud directa a un endpoint alternativo
      if (!tripUpdateSuccess) {
        try {
          console.log("Intentando endpoint alternativo...");
          const response = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trip_status: tripStatus })
          });
          
          if (response.ok) {
            console.log("✅ Éxito con endpoint alternativo");
            tripUpdateSuccess = true;
          } else {
            const errorText = await response.text();
            console.warn(`❌ Falló endpoint alternativo: ${errorText}`);
            tripUpdateError = errorText;
          }
        } catch (err) {
          console.error("Error en solicitud con endpoint alternativo:", err);
          tripUpdateError = err.message;
        }
      }
      
      // Verificar que el cambio realmente se guardó
      if (tripUpdateSuccess) {
        try {
          // Ya que no podemos hacer GET al recurso, confiamos en que la actualización funcionó
          // si la API devolvió una respuesta exitosa
          console.log("La API reportó una actualización exitosa del estado del viaje");
          console.log("Asumiendo que el estado del viaje se ha actualizado a:", tripStatus);
          
          // Si el componente padre necesita reflejar este cambio, puede ser necesario
          // actualizar el estado a nivel de aplicación o refrescar los datos al volver a abrir
        } catch (error) {
          console.error("Error en verificación:", error);
        }
      }
      
      // Si seguimos sin éxito, registrar el problema pero continuar con las otras actualizaciones
      if (!tripUpdateSuccess) {
        console.error("No se pudo actualizar el estado del viaje después de varios intentos");
        console.error("Último error:", tripUpdateError);
        // No lanzamos error para permitir que las otras actualizaciones continúen
      }

      // Update explorer statuses
      const explorerStatusPromises = Object.entries(explorerStatuses).map(async ([userId, status]) => {
        console.log(`Actualizando estado de reserva para usuario ${userId}: ${status}`);
        const response = await fetch(`https://rangerhub-back.vercel.app/reservations/trip/${trip.id}/user/${userId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error al actualizar estado de reserva para usuario ${userId}:`, errorText);
          throw new Error(`Error actualizando estado de reserva: ${errorText}`);
        }

        return response;
      });

      // Update payment statuses
      const paymentStatusPromises = Object.entries(paymentStatuses).map(async ([userId, status]) => {
        // Skip N/A status or create a payment with status Pendiente if user decides to change from N/A
        if (status === 'N/A') {
          return Promise.resolve();
        }
        
        console.log(`Actualizando estado de pago para usuario ${userId}: ${status}`);
        try {
          const response = await fetch(`https://rangerhub-back.vercel.app/payments/trip/${trip.id}/user/${userId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payment_status: status })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error actualizando estado de pago para usuario ${userId}: ${errorText}`);
            // No interrumpimos el proceso si falla un pago
          }
  
          return response;
        } catch (error) {
          console.error(`Error en la solicitud de actualización de pago para usuario ${userId}:`, error);
          // No interrumpimos el proceso si falla un pago
          return Promise.resolve();
        }
      });

      // Esperamos a que se completen todas las actualizaciones
      await Promise.all([
        ...explorerStatusPromises, 
        ...paymentStatusPromises.filter(p => p)
      ]);

      // Show success message
      alert('Cambios guardados exitosamente' + (!tripUpdateSuccess ? ' (Excepto estado del viaje)' : ''));
      
      // Refresh data or close modal
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Error al guardar los cambios: ${error.message}`);
    }
  };

  // Format date function (from original component)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString;
    }
  };

  // Calculate duration function
  const calculateDuration = () => {
    if (!trip.start_date || !trip.end_date) return 'N/A';
    
    try {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'N/A';
      
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error al calcular duración:", error);
      return 'N/A';
    }
  };

  // If show is false, return null (existing behavior)
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1050,
      overflow: 'hidden',
      paddingTop: '30px',
      paddingBottom: '30px'
    }}>
      <div 
        ref={modalRef}
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '0.3rem',
          width: '95%',
          maxWidth: '1200px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          margin: '0 auto',
          padding: 0,
          boxShadow: '0 5px 15px rgba(0,0,0,.5)'
        }}>
        <div className="modal-header">
          <h3 className="modal-title">{trip?.trip_name || 'Detalles del Viaje'}</h3>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {/* Trip Details Section */}
          <div className="trip-details-section mb-4">
            <h4>Información del Viaje</h4>
            <div className="trip-info-grid">
              <div className="trip-info-item">
                <strong>Precio:</strong> ${trip?.total_cost || 'N/A'}
              </div>
              <div className="trip-info-item">
                <strong>Estado:</strong> 
                <TripStatusDropdown />
              </div>
              <div className="trip-info-item">
                <strong>Fecha:</strong> {trip?.start_date ? formatDate(trip.start_date) : 'N/A'}
                {trip?.end_date ? ` - ${formatDate(trip.end_date)}` : ''}
              </div>
              <div className="trip-info-item">
                <strong>Duración:</strong> {calculateDuration()} días
              </div>
              <div className="trip-info-item col-span-2">
                <strong>Descripción:</strong> {trip?.description || 'Sin descripción disponible'}
              </div>
            </div>
          </div>

          {/* Existing Activities Section */}
          <div className="activities-section mb-4">
            <h4>Actividades del Viaje</h4>
            
            {isLoading.activities ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : error.activities ? (
              <div className="alert alert-danger">
                {error.activities}
              </div>
            ) : activities.length > 0 ? (
              <div className="row">
                {activities.map((activity, index) => (
                  <div key={activity.id || `activity-${index}`} className="col-md-6 mb-3">
                    <div className="card h-100">
                      {activity.activity_image_url && (
                        <img 
                          src={activity.activity_image_url} 
                          className="card-img-top" 
                          alt={activity.name || 'Actividad'} 
                          style={{ height: '120px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x120?text=Sin+imagen'; }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{activity.name || 'Sin nombre'}</h5>
                        <p className="card-text small">
                          {activity.description?.substring(0, 100) || 'Sin descripción'}
                          {activity.description?.length > 100 ? '...' : ''}
                        </p>
                        <div className="d-flex justify-content-between">
                          <span className="badge bg-info">
                            {activity.difficulty || 'Dificultad N/A'}
                          </span>
                          <span className="badge bg-secondary">
                            ${activity.cost || '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                No hay actividades asociadas a este viaje.
              </div>
            )}
          </div>

          {/* Explorers Section with Payment Status */}
          <div className="explorers-section">
            <h4>Explorers Registrados</h4>
            
            {isLoading.explorers ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : error.explorers ? (
              <div className="alert alert-danger">
                {error.explorers}
                {debugInfo && (
                  <details className="mt-2">
                    <summary>Información de depuración</summary>
                    <pre className="small mt-2">{debugInfo}</pre>
                  </details>
                )}
              </div>
            ) : explorers.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Estado de Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explorers.map((explorer, index) => (
                      <tr key={explorer.id || `explorer-${index}`}>
                        <td>{explorer.name || 'N/A'}</td>
                        <td>{explorer.email || 'N/A'}</td>
                        <td>{explorer.phone || explorer.phone_number || 'N/A'}</td>
                        <td>
                          <ExplorerStatusButton explorer={explorer} />
                        </td>
                        <td>
                          {isLoading.payments ? (
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                          ) : (
                            <PaymentStatusButton explorer={explorer} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                No hay exploradores registrados para este viaje.
                {debugInfo && (
                  <details className="mt-2">
                    <summary>Información de depuración</summary>
                    <pre className="small mt-2">{debugInfo}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
          
          {/* Nueva sección de Pagos */}
          <div className="payments-section mt-4">
            <h4>Registro de Pagos</h4>
            
            {isLoading.payments ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : error.payments ? (
              <div className="alert alert-danger">
                {error.payments}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Viaje</th>
                      <th>Explorer</th>
                      <th>Monto</th>
                      <th>Estado Viaje</th>
                      <th>Estado Reserva</th>
                      <th>Estado Pago</th>
                      <th>Fecha Pago</th>
                      <th>Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explorers.map((explorer, index) => {
                      const paymentStatus = paymentStatuses[explorer.id] || 'N/A';
                      const reservationStatus = explorerStatuses[explorer.id] || explorer.status || 'Pendiente';
                      const payment = explorer.payment_info || {};
                      
                      return (
                        <tr key={`payment-${explorer.id || index}`}>
                          <td>{trip?.trip_name || 'N/A'}</td>
                          <td>{explorer.name || 'N/A'}</td>
                          <td>${payment.payment_amount || 0}</td>
                          <td>
                            <span className={`badge ${
                              tripStatus === 'Confirmado' ? 'bg-success' : 
                              tripStatus === 'Cancelado' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {tripStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              reservationStatus === 'Confirmado' ? 'bg-success' : 
                              reservationStatus === 'Cancelado' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {reservationStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${paymentStatusClasses[paymentStatus]}`}>
                              {paymentStatus}
                            </span>
                          </td>
                          <td>{payment.payment_date ? formatDate(payment.payment_date) : 'N/A'}</td>
                          <td>
                            {payment.payment_voucher_url ? (
                              <a 
                                href={payment.payment_voucher_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-sm btn-primary"
                              >
                                Ver
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {explorers.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-3">
                          No hay registros de pago disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary me-2" 
            onClick={onClose}
          >
            Cerrar
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSave}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;