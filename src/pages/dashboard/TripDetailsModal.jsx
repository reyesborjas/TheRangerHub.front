import React, { useState, useEffect } from 'react';

const TripDetailsModal = ({ trip, show, onClose }) => {
  // Estados principales
  const [explorers, setExplorers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tripStatus, setTripStatus] = useState('');
  const [explorerStatuses, setExplorerStatuses] = useState({});
  const [paymentStatuses, setPaymentStatuses] = useState({});
  
  // Estados de carga y error
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

  // Inicializar datos cuando se abre el modal
  useEffect(() => {
    if (show && trip) {
      console.log("Modal abierto con datos de viaje:", trip);
      // Establecer estado del viaje
      const initialStatus = trip?.trip_status || trip?.status || 'Pendiente';
      console.log("Estado inicial del viaje:", initialStatus);
      setTripStatus(initialStatus);
      
      // Limpiar estados anteriores
      setExplorerStatuses({});
      setPaymentStatuses({});
      
      // Cargar datos
      fetchExplorers();
      fetchActivities();
    } else {
      // Limpiar datos cuando se cierra el modal
      setExplorers([]);
      setActivities([]);
      setExplorerStatuses({});
      setPaymentStatuses({});
      setError({
        explorers: null,
        activities: null,
        payments: null
      });
      setDebugInfo(null);
    }
  }, [show, trip]);

  // Cargar información de pagos después de cargar exploradores
  useEffect(() => {
    if (explorers.length > 0 && trip?.id && show) {
      fetchPaymentStatuses();
    }
  }, [explorers.length, trip?.id, show]);

  // Configuraciones para estados
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

  const explorerStatusOptions = ['Pendiente', 'Confirmado', 'Cancelado'];
  const explorerStatusClasses = {
    'Pendiente': 'bg-warning',
    'Confirmado': 'bg-success', 
    'Cancelado': 'bg-danger'
  };

  // Componente de dropdown para estado del viaje
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
          {tripStatus || 'Seleccionar'}
        </button>
        {isOpen && (
          <div className="dropdown-menu" style={{display: 'block', position: 'absolute'}}>
            {tripStatusOptions.map((option) => (
              <button
                key={option.label}
                className={`dropdown-item ${option.className}`}
                onClick={() => {
                  console.log("Cambiando estado de viaje a:", option.label);
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

  // Botón para cambiar estado del explorador
  const ExplorerStatusButton = ({ explorer }) => {
    const getCurrentStatus = () => {
      return explorerStatuses[explorer.id] || explorer.status || 'Pendiente';
    };

    const handleStatusChange = () => {
      const currentStatus = getCurrentStatus();
      console.log(`Cambiando estado de explorador ${explorer.id} de ${currentStatus}`);
      
      const currentIndex = explorerStatusOptions.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % explorerStatusOptions.length;
      const nextStatus = explorerStatusOptions[nextIndex];
      
      console.log(`Nuevo estado: ${nextStatus}`);
      setExplorerStatuses(prev => ({
        ...prev,
        [explorer.id]: nextStatus
      }));
    };

    const currentStatus = getCurrentStatus();

    return (
      <button
        onClick={handleStatusChange}
        type="button"
        className={`badge ${explorerStatusClasses[currentStatus]} text-white`}
      >
        {currentStatus}
      </button>
    );
  };

  // Botón para cambiar estado de pago
  const PaymentStatusButton = ({ explorer }) => {
    const getCurrentStatus = () => {
      return paymentStatuses[explorer.id] || explorer.payment_status || 'N/A';
    };

    const handleStatusChange = () => {
      const currentStatus = getCurrentStatus();
      console.log(`Cambiando estado de pago para explorador ${explorer.id} de ${currentStatus}`);
      
      const currentIndex = paymentStatusOptions.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % paymentStatusOptions.length;
      const nextStatus = paymentStatusOptions[nextIndex];
      
      console.log(`Nuevo estado de pago: ${nextStatus}`);
      setPaymentStatuses(prev => ({
        ...prev,
        [explorer.id]: nextStatus
      }));
    };

    const currentStatus = getCurrentStatus();

    return (
      <button
        onClick={handleStatusChange}
        type="button"
        className={`badge ${paymentStatusClasses[currentStatus]} text-white`}
      >
        {currentStatus}
      </button>
    );
  };

  // Función para cargar exploradores
  const fetchExplorers = async () => {
    if (!trip || !trip.id) return;
    
    setIsLoading(prev => ({ ...prev, explorers: true }));
    setError(prev => ({ ...prev, explorers: null }));
    
    try {
      console.log(`Obteniendo explorers para viaje ID: ${trip.id}`);
      
      const response = await fetch(`https://rangerhub-back.vercel.app/reservations/trip/${trip.id}/explorers`);
      
      console.log(`Respuesta explorers: status ${response.status}`);
      
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
      
      console.log("Datos de explorers:", data);
      
      if (data && data.explorers) {
        if (Array.isArray(data.explorers)) {
          const normalizedExplorers = data.explorers.map(explorer => {
            if (Array.isArray(explorer)) {
              return {
                id: explorer[0] || `temp-id-${Math.random()}`,
                name: explorer[1] || 'N/A',
                email: explorer[2] || 'N/A',
                phone: explorer[3] || 'N/A',
                status: explorer[4] || 'Pendiente'
              };
            }
            
            return {
              id: explorer.id || `temp-id-${Math.random()}`,
              name: explorer.name || 'N/A',
              email: explorer.email || 'N/A',
              phone: explorer.phone || explorer.phone_number || 'N/A',
              status: explorer.status || 'Pendiente'
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

  // Función para cargar actividades
  const fetchActivities = async () => {
    if (!trip || !trip.id) return;
    
    setIsLoading(prev => ({ ...prev, activities: true }));
    setError(prev => ({ ...prev, activities: null }));
    
    try {
      console.log(`Obteniendo actividades para viaje ID: ${trip.id}`);
      
      const response = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}/activities`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener actividades`);
      }
      
      const data = await response.json();
      console.log("Datos de actividades:", data);
      
      if (!data || !Array.isArray(data.activities)) {
        console.warn("Formato inesperado en datos de actividades:", data);
        setActivities([]);
        return;
      }
      
      setActivities(data.activities);
      console.log(`Se encontraron ${data.activities.length} actividades`);
      
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      setError(prev => ({ ...prev, activities: `Error: ${error.message}` }));
      setActivities([]);
    } finally {
      setIsLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Función para cargar estados de pago
  const fetchPaymentStatuses = async () => {
    if (!trip || !trip.id || explorers.length === 0) return;
    
    setIsLoading(prev => ({ ...prev, payments: true }));
    setError(prev => ({ ...prev, payments: null }));
    
    try {
      console.log(`Inicializando estados de pago para viaje ID: ${trip.id}`);
      
      // Inicializar estados como 'N/A'
      const initialStatuses = {};
      explorers.forEach(explorer => {
        initialStatuses[explorer.id] = 'N/A';
      });
      
      setPaymentStatuses(initialStatuses);
      
      // Intentar obtener información de pagos
      try {
        const response = await fetch(`https://rangerhub-back.vercel.app/payments/trip/${trip.id}`);
        
        if (response.ok) {
          const payments = await response.json();
          console.log("Pagos encontrados:", payments);
          
          const updatedStatuses = {...initialStatuses};
          
          if (payments && Array.isArray(payments)) {
            payments.forEach(payment => {
              if (payment.user_id && payment.payment_status) {
                updatedStatuses[payment.user_id] = payment.payment_status;
              }
            });
            
            // Actualizar explorers con info de pago
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
          console.warn("No se pudieron obtener los pagos:", response.statusText);
        }
      } catch (err) {
        console.warn("Error al obtener pagos:", err);
      }
      
      setTimeout(() => {
        setIsLoading(prev => ({ ...prev, payments: false }));
      }, 500);
      
    } catch (error) {
      console.error("Error al obtener estados de pago:", error);
      setError(prev => ({ ...prev, payments: `Error: ${error.message}` }));
      setIsLoading(prev => ({ ...prev, payments: false }));
    }
  };

  // Función para guardar cambios
  const handleSave = async () => {
    try {
      console.log("Guardando cambios del viaje...");
      console.log("ID del viaje:", trip.id);
      console.log("Estado del viaje a guardar:", tripStatus);
      
      // 1. Actualizar estado del viaje
      try {
        console.log(`Enviando actualización de estado a /trips/${trip.id}/status`);
        console.log("Cuerpo de la solicitud:", JSON.stringify({ status: tripStatus }));
        
        const tripUpdateResponse = await fetch(`https://rangerhub-back.vercel.app/trips/${trip.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: tripStatus })
        });
        
        console.log("Respuesta de actualización de estado:", tripUpdateResponse.status);
        
        if (!tripUpdateResponse.ok) {
          const errorText = await tripUpdateResponse.text();
          console.error("Error al actualizar estado del viaje:", errorText);
          alert(`Error al actualizar estado del viaje: ${errorText}`);
        } else {
          console.log("✅ Estado del viaje actualizado exitosamente");
        }
      } catch (error) {
        console.error("Error en solicitud de actualización de estado:", error);
        alert(`Error en solicitud de actualización: ${error.message}`);
      }

      // 2. Actualizar estados de exploradores
      const explorerPromises = Object.entries(explorerStatuses).map(async ([userId, status]) => {
        console.log(`Actualizando estado de explorador ${userId} a ${status}`);
        
        try {
          const response = await fetch(`https://rangerhub-back.vercel.app/reservations/trip/${trip.id}/user/${userId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error actualizando estado de reserva para usuario ${userId}:`, errorText);
            return { userId, success: false, error: errorText };
          }
          
          return { userId, success: true };
        } catch (error) {
          console.error(`Error en solicitud para usuario ${userId}:`, error);
          return { userId, success: false, error: error.message };
        }
      });

      // 3. Actualizar estados de pago
      const paymentPromises = Object.entries(paymentStatuses).map(async ([userId, status]) => {
        // Omitir estado N/A
        if (status === 'N/A') {
          return { userId, success: true, skipped: true };
        }
        
        console.log(`Actualizando estado de pago para usuario ${userId} a ${status}`);
        
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
            console.error(`Error actualizando pago para usuario ${userId}:`, errorText);
            return { userId, success: false, error: errorText };
          }
          
          return { userId, success: true };
        } catch (error) {
          console.error(`Error en solicitud de pago para usuario ${userId}:`, error);
          return { userId, success: false, error: error.message };
        }
      });

      // Esperar a que se completen todas las actualizaciones
      const explorerResults = await Promise.all(explorerPromises);
      const paymentResults = await Promise.all(paymentPromises);
      
      // Verificar resultados para mostrar mensaje apropiado
      const failedExplorers = explorerResults.filter(r => !r.success);
      const failedPayments = paymentResults.filter(r => !r.success && !r.skipped);
      
      if (failedExplorers.length === 0 && failedPayments.length === 0) {
        alert('¡Todos los cambios guardados exitosamente!');
        onClose();
      } else {
        let errorMessage = 'Se guardaron algunos cambios, pero hubo errores:\n\n';
        
        if (failedExplorers.length > 0) {
          errorMessage += `- ${failedExplorers.length} estados de exploradores no se actualizaron\n`;
        }
        
        if (failedPayments.length > 0) {
          errorMessage += `- ${failedPayments.length} estados de pago no se actualizaron\n`;
        }
        
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Error general al guardar cambios:', error);
      alert(`Error al guardar cambios: ${error.message}`);
    }
  };

  // Formatear fecha
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

  // Calcular duración
  const calculateDuration = () => {
    if (!trip?.start_date || !trip?.end_date) return 'N/A';
    
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
      overflow: 'auto',
      padding: '30px 0'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'white',
        borderRadius: '0.3rem',
        width: '95%',
        maxWidth: '1200px',
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'auto',
        margin: '0 auto',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)'
      }}>
        <div className="modal-header">
          <h3 className="modal-title">{trip?.trip_name || 'Detalles del Viaje'}</h3>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {/* Información del Viaje */}
          <div className="trip-details-section mb-4">
            <h4>Información del Viaje</h4>
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Precio:</strong> ${trip?.total_cost || 'N/A'}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Estado:</strong> <TripStatusDropdown />
              </div>
              <div className="col-md-6 mb-2">
                <strong>Fecha:</strong> {trip?.start_date ? formatDate(trip.start_date) : 'N/A'}
                {trip?.end_date ? ` - ${formatDate(trip.end_date)}` : ''}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Duración:</strong> {calculateDuration()} días
              </div>
              <div className="col-12 mb-2">
                <strong>Descripción:</strong> {trip?.description || 'Sin descripción disponible'}
              </div>
            </div>
          </div>

          {/* Actividades */}
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

          {/* Explorers */}
          <div className="explorers-section mb-4">
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
          
          {/* Pagos */}
          <div className="payments-section">
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
                      <th>Explorer</th>
                      <th>Monto</th>
                      <th>Estado Viaje</th>
                      <th>Estado Reserva</th>
                      <th>Estado Pago</th>
                      <th>Fecha Actualización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explorers.map((explorer, index) => {
                      const paymentStatus = paymentStatuses[explorer.id] || 'N/A';
                      const reservationStatus = explorerStatuses[explorer.id] || explorer.status || 'Pendiente';
                      const payment = explorer.payment_info || {};
                      
                      return (
                        <tr key={`payment-${explorer.id || index}`}>
                          <td>{explorer.name || 'N/A'}</td>
                          <td>${payment.payment_amount || trip?.total_cost || 0}</td>
                          <td>
                            <span className={`badge ${
                              tripStatus === 'Confirmado' ? 'bg-success' : 
                              tripStatus === 'Cancelado' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {tripStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${explorerStatusClasses[reservationStatus]}`}>
                              {reservationStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${paymentStatusClasses[paymentStatus]}`}>
                              {paymentStatus}
                            </span>
                          </td>
                          <td>{new Date().toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                    {explorers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-3">
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
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;