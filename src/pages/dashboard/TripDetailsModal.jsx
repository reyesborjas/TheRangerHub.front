import React, { useState, useEffect } from 'react';

const TripDetailsModal = ({ trip, show, onClose }) => {
  const [explorers, setExplorers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (show && trip) {
      fetchExplorers();
    } else {
      // Limpiar datos cuando se cierra el modal
      setExplorers([]);
      setError(null);
      setDebugInfo(null);
    }
  }, [show, trip]);

  const fetchExplorers = async () => {
    if (!trip || !trip.id) return;
    
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log(`Fetching explorers for trip ID: ${trip.id}`);
      
      const response = await fetch(`https://rangerhub-back.vercel.app/reservations/trip/${trip.id}/explorers`);
      
      // Registrar detalles de la respuesta para depuración
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries([...response.headers]));
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener los exploradores`);
      }
      
      const responseText = await response.text();
      console.log(`Raw response: ${responseText}`);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error(`Error al procesar la respuesta: ${parseError.message}`);
      }
      
      console.log("Parsed data:", data);
      
      if (data && data.explorers) {
        if (Array.isArray(data.explorers)) {
          // Normalizar datos para asegurar que todos sean objetos con las propiedades esperadas
          const normalizedExplorers = data.explorers.map(explorer => {
            // Si el explorador es un array, convertirlo a objeto
            if (Array.isArray(explorer)) {
              return {
                id: explorer[0] || `temp-id-${Math.random()}`,
                name: explorer[1] || 'N/A',
                email: explorer[2] || 'N/A',
                phone: explorer[3] || 'N/A',
                status: explorer[4] || 'pending'
              };
            }
            
            // Si ya es un objeto, asegurar propiedades consistentes
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
        setDebugInfo(`Respuesta sin datos de exploradores: ${JSON.stringify(data)}`);
        setExplorers([]);
      }
      
    } catch (error) {
      console.error("Error al obtener exploradores:", error);
      setError(`Error: ${error.message}`);
      setDebugInfo(`Stack trace: ${error.stack}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{trip?.trip_name || 'Detalles del Viaje'}</h3>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {/* Detalles del viaje */}
          <div className="trip-details-section mb-4">
            <h4>Información del Viaje</h4>
            <div className="trip-info-grid">
              <div className="trip-info-item">
                <strong>Precio:</strong> ${trip?.total_cost || 'N/A'}
              </div>
              <div className="trip-info-item">
                <strong>Estado:</strong> {trip?.status || 'N/A'}
              </div>
              <div className="trip-info-item">
                <strong>Fecha:</strong> {trip?.trip_date || 'N/A'}
              </div>
              <div className="trip-info-item">
                <strong>Duración:</strong> {trip?.duration || 'N/A'} días
              </div>
              <div className="trip-info-item col-span-2">
                <strong>Descripción:</strong> {trip?.description || 'Sin descripción disponible'}
              </div>
            </div>
          </div>

          {/* Lista de Explorers */}
          <div className="explorers-section">
            <h4>Explorers Registrados</h4>
            
            {isLoading ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                {error}
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
                    </tr>
                  </thead>
                  <tbody>
                    {explorers.map((explorer, index) => (
                      <tr key={explorer.id || `explorer-${index}`}>
                        <td>{explorer.name || 'N/A'}</td>
                        <td>{explorer.email || 'N/A'}</td>
                        <td>{explorer.phone || explorer.phone_number || 'N/A'}</td>
                        <td>
                          <span className={`badge ${explorer.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                            {explorer.status === 'paid' ? 'Pagado' : 'Pendiente'}
                          </span>
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
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;