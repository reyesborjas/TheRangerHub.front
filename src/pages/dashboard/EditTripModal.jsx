import React, { useState, useEffect } from 'react';

const EditTripModal = ({ trip, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    trip_name: '',
    lead_ranger: '',
    start_date: '',
    end_date: '',
    participants_number: 0,
    trip_status: 'pending',
    estimated_weather_forecast: '',
    description: '',
    total_cost: 0,
    trip_image_url: ''
  });
  
  const [rangers, setRangers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRangers, setIsLoadingRangers] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del viaje cuando se abre el modal
  useEffect(() => {
    if (show && trip) {
      // Formatear fechas para el input date
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        id: trip.id, // Incluir el ID para indicar que es una actualización
        trip_name: trip.trip_name || '',
        lead_ranger: trip.lead_ranger || '',
        start_date: formatDate(trip.start_date),
        end_date: formatDate(trip.end_date),
        participants_number: trip.participants_number || 0,
        trip_status: trip.trip_status || 'pending',
        estimated_weather_forecast: trip.estimated_weather_forecast || '',
        description: trip.description || '',
        total_cost: trip.total_cost || 0,
        trip_image_url: trip.trip_image_url || ''
      });

      // Cargar la lista de rangers
      fetchRangers();
    }
  }, [show, trip]);

  const fetchRangers = async () => {
    setIsLoadingRangers(true);
    try {
      const response = await fetch('https://rangerhub-back.vercel.app/rangers');
      
      if (!response.ok) {
        throw new Error('Error al cargar la lista de rangers');
      }
      
      const data = await response.json();
      setRangers(data.rangers || []);
    } catch (error) {
      console.error('Error al cargar rangers:', error);
      setError('No se pudo cargar la lista de rangers. ' + error.message);
    } finally {
      setIsLoadingRangers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Enviando datos de actualización:', formData);
      
      const response = await fetch('https://rangerhub-back.vercel.app/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el viaje');
      }

      const data = await response.json();
      console.log('Respuesta de actualización:', data);
      
      // Crear objeto actualizado para pasar al componente padre
      const updatedTrip = {
        ...trip,
        ...formData,
        id: trip.id
      };
      
      onSave(updatedTrip);
      onClose();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content edit-trip-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Editar Viaje</h3>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="alert alert-danger mb-3">{error}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="trip_name" className="form-label">Nombre del Viaje*</label>
                <input
                  type="text"
                  className="form-control"
                  id="trip_name"
                  name="trip_name"
                  value={formData.trip_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="lead_ranger" className="form-label">Ranger Responsable*</label>
                {isLoadingRangers ? (
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    <span>Cargando rangers...</span>
                  </div>
                ) : rangers.length > 0 ? (
                  <select
                    className="form-select"
                    id="lead_ranger"
                    name="lead_ranger"
                    value={formData.lead_ranger}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Ranger</option>
                    {rangers.map(ranger => (
                      <option key={ranger.id} value={ranger.id}>
                        {ranger.full_name} ({ranger.username})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="lead_ranger"
                    name="lead_ranger"
                    value={formData.lead_ranger}
                    onChange={handleChange}
                    required
                    placeholder="No se pudo cargar la lista. Ingrese ID del ranger"
                  />
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="start_date" className="form-label">Fecha de Inicio*</label>
                <input
                  type="date"
                  className="form-control"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="end_date" className="form-label">Fecha de Fin*</label>
                <input
                  type="date"
                  className="form-control"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="participants_number" className="form-label">Número de Participantes</label>
                <input
                  type="number"
                  className="form-control"
                  id="participants_number"
                  name="participants_number"
                  value={formData.participants_number}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="trip_status" className="form-label">Estado del Viaje</label>
                <select
                  className="form-select"
                  id="trip_status"
                  name="trip_status"
                  value={formData.trip_status}
                  onChange={handleChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="total_cost" className="form-label">Costo Total</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    id="total_cost"
                    name="total_cost"
                    value={formData.total_cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="estimated_weather_forecast" className="form-label">Pronóstico del Clima</label>
                <input
                  type="text"
                  className="form-control"
                  id="estimated_weather_forecast"
                  name="estimated_weather_forecast"
                  value={formData.estimated_weather_forecast}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="trip_image_url" className="form-label">URL de la Imagen</label>
              <input
                type="url"
                className="form-control"
                id="trip_image_url"
                name="trip_image_url"
                value={formData.trip_image_url}
                onChange={handleChange}
              />
              {formData.trip_image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.trip_image_url} 
                    alt="Vista previa de la imagen" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '100px' }} 
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;