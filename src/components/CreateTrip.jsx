import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [resources, setResources] = useState([]);
  const [rangers, setRangers] = useState([]);
  const [loading, setLoading] = useState({
    activities: true,
    resources: true,
    rangers: true
  });
  const [formData, setFormData] = useState({
    trip_name: "",
    start_date: "",
    end_date: "",
    participants_number: "",
    trip_status: "pending",
    estimated_weather_forecast:
      "Temperatura mínima:  Temperatura máxima: Expectativas de lluvias (si/no): ",
    description: "",
    total_cost: "",
    trip_image_url: "",
    activities: [],
    resources: [], 
    lead_ranger: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch de activities
        setLoading(prev => ({...prev, activities: true}));
        const activitiesResponse = await fetch("https://rangerhub-back.vercel.app/activities");
        const activitiesData = await activitiesResponse.json();
        const formattedActivities = (activitiesData.activities || []).map(act => ({
          ...act,
          id: String(act.id) // Asegurar que ID sea string
        }));
        setActivities(formattedActivities);
        console.log("Actividades cargadas:", formattedActivities);
        setLoading(prev => ({...prev, activities: false}));

        // Fetch de resources
        setLoading(prev => ({...prev, resources: true}));
        const resourcesResponse = await fetch("https://rangerhub-back.vercel.app/resources");
        const resourcesData = await resourcesResponse.json();
        const formattedResources = (resourcesData.resources || []).map(res => ({
          ...res,
          id: String(res.id) // Asegurar que ID sea string
        }));
        setResources(formattedResources);
        console.log("Recursos cargados:", formattedResources);
        setLoading(prev => ({...prev, resources: false}));

        // Fetch de rangers
        setLoading(prev => ({...prev, rangers: true}));
        const rangersResponse = await fetch("https://rangerhub-back.vercel.app/rangers");
        if (!rangersResponse.ok) {
          throw new Error("Error al obtener rangers");
        }
        const rangersData = await rangersResponse.json();
        if (!rangersData.rangers || !Array.isArray(rangersData.rangers)) {
          throw new Error("Formato de respuesta inválido");
        }
        const formattedRangers = rangersData.rangers.map(ranger => ({
          ...ranger,
          id: String(ranger.id) // Asegurar que ID sea string
        }));
        setRangers(formattedRangers);
        console.log("Rangers cargados:", formattedRangers);
        setLoading(prev => ({...prev, rangers: false}));
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error al cargar datos: " + error.message);
        setLoading({activities: false, resources: false, rangers: false});
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "start_date" || name === "end_date") {
      value += "T00:00:00Z";
    }

    if (["participants_number", "total_cost"].includes(name)) {
      value = Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRangerChange = (e) => {
    const rangerId = e.target.value;
    console.log("Ranger seleccionado:", rangerId);
    setFormData(prev => ({ ...prev, lead_ranger: rangerId }));
  };

  const handleActivityChange = (e, index) => {
    const newValue = e.target.value;
    console.log(`Actividad en índice ${index} cambiada a:`, newValue);
    
    if (newValue && formData.activities.some((act, i) => i !== index && act === newValue)) {
      alert("Esta actividad ya está seleccionada. Por favor, elige otra.");
      return;
    }
    
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = newValue;
    
    setFormData(prev => ({ 
      ...prev, 
      activities: updatedActivities 
    }));
  };

  const addActivity = () => {
    setFormData(prev => ({ ...prev, activities: [...prev.activities, ""] }));
  };

  const removeActivity = (index) => {
    const updatedActivities = [...formData.activities];
    updatedActivities.splice(index, 1);
    setFormData(prev => ({ ...prev, activities: updatedActivities }));
  };

  const handleResourceChange = (e, index) => {
    const newValue = e.target.value;
    console.log(`Recurso en índice ${index} cambiado a:`, newValue);
    
    if (newValue && formData.resources.some((res, i) => i !== index && res === newValue)) {
      alert("Este recurso ya está seleccionado. Por favor, elige otro.");
      return;
    }
    
    const updatedResources = [...formData.resources];
    updatedResources[index] = newValue;
    
    setFormData(prev => ({ 
      ...prev, 
      resources: updatedResources 
    }));
  };

  const addResource = () => {
    setFormData(prev => ({ ...prev, resources: [...prev.resources, ""] }));
  };

  const removeResource = (index) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    setFormData(prev => ({ ...prev, resources: updatedResources }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, trip_image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Calcular el costo estimado (recursos + actividades)
  const calculateEstimatedCost = () => {
    let total = 0;
    
    // Sumar costos de recursos seleccionados
    formData.resources.forEach(resourceId => {
      if (resourceId) {
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
          total += parseFloat(resource.cost || 0);
        }
      }
    });
    
    // Sumar costos de actividades seleccionadas
    formData.activities.forEach(activityId => {
      if (activityId) {
        const activity = activities.find(a => a.id === activityId);
        if (activity) {
          total += parseFloat(activity.cost || 0);
        }
      }
    });
    
    return total.toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Validación mejorada de actividades
      const activitiesList = formData.activities.filter(activity => activity !== "");
      if (activitiesList.length === 0) {
        alert("Debes seleccionar al menos una actividad válida");
        return;
      }
      
      // Filtrar recursos vacíos
      const resourcesList = formData.resources.filter(resource => resource !== "");
  
      // Enviar datos básicos del viaje
      const tripResponse = await fetch("https://rangerhub-back.vercel.app/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          activities: undefined, // Excluir actividades del payload
          resources: undefined, // Excluir recursos del payload
        }),
      });
  
      if (!tripResponse.ok) {
        const errorData = await tripResponse.json();
        throw new Error(errorData.error || "Error al crear el viaje");
      }
      
      const tripData = await tripResponse.json();
      const tripId = tripData.id;
  
      // Enviar actividades en paralelo con control de errores
      const activityResults = await Promise.allSettled(
        activitiesList.map(activityId =>
          fetch("https://rangerhub-back.vercel.app/activity-trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              trip_id: tripId, 
              activity_id: activityId 
            }),
          })
        )
      );
      
      // Enviar recursos en paralelo con control de errores
      const resourceResults = await Promise.allSettled(
        resourcesList.map(resourceId =>
          fetch("https://rangerhub-back.vercel.app/trips-resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              trip_id: tripId, 
              resource_id: resourceId 
            }),
          })
        )
      );
  
      // Verificar errores en actividades
      const failedActivities = activityResults.filter(r => r.status === "rejected");
      if (failedActivities.length > 0) {
        console.error("Errores en actividades:", failedActivities);
        throw new Error(`${failedActivities.length} actividades no se pudieron asociar`);
      }
      
      // Verificar errores en recursos
      const failedResources = resourceResults.filter(r => r.status === "rejected");
      if (failedResources.length > 0) {
        console.error("Errores en recursos:", failedResources);
        throw new Error(`${failedResources.length} recursos no se pudieron asociar`);
      }
  
      navigate("/dashboard/trips");
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message);
    }
  };
  return (
    <>
      <div className="container create-trip-container">
        <div className="content-container col-md-12">
          <div className="card p-4 shadow-lg create-trip-box">
            <h2 className="text-center">Crear Viaje</h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="trip_name"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Número de Participantes Máximo</label>
                  <input
                    type="number"
                    className="form-control"
                    name="participants_number"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Costo Total</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="total_cost"
                      value={formData.total_cost}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-group-text">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          const estimatedCost = calculateEstimatedCost();
                          setFormData(prev => ({...prev, total_cost: parseFloat(estimatedCost)}));
                        }}
                        title="Calcular basado en actividades y recursos"
                      >
                        Calcular
                      </button>
                    </span>
                  </div>
                  <small className="form-text text-muted">
                    Costo estimado de actividades y recursos: ${calculateEstimatedCost()}
                  </small>
                </div>
              </div>
  
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="description"
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Sección de Actividades mejorada */}
              <div className="mb-3">
                <label className="form-label">Actividades</label>
                {loading.activities ? (
                  <p className="text-muted">Cargando actividades...</p>
                ) : (
                  <>
                    {/* Lista visual de actividades seleccionadas */}
                    {formData.activities.filter(id => id).length > 0 && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <h6 className="fw-bold">Actividades seleccionadas:</h6>
                        <ul className="list-group">
                          {formData.activities.filter(id => id).map((activityId, idx) => {
                            const activityObj = activities.find(a => a.id === activityId);
                            return activityObj ? (
                              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>{activityObj.name}</div>
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-primary rounded-pill me-2">${activityObj.cost || 0}</span>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeActivity(idx)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {/* Selector de actividades */}
                    <div className="activity-selectors">
                      {formData.activities.length === 0 ? (
                        <p className="text-muted">No hay actividades seleccionadas</p>
                      ) : (
                        formData.activities.map((activityId, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <select
                              className="form-control me-2"
                              value={activityId}
                              onChange={(e) => handleActivityChange(e, index)}
                              required
                            >
                              <option value="">Seleccionar actividad</option>
                              {activities.map((act) => (
                                <option key={act.id} value={act.id}>
                                  {act.name} (${act.cost || 0})
                                </option>
                              ))}
                            </select>
                            {/* Solo mostrar el botón para eliminar si no se muestra en la lista superior */}
                            {!activityId && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeActivity(index)}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={addActivity}
                    >
                      Agregar Actividad
                    </button>
                  </>
                )}
              </div>
  
              {/* Sección de Recursos mejorada */}
              <div className="mb-3">
                <label className="form-label">Recursos</label>
                {loading.resources ? (
                  <p className="text-muted">Cargando recursos...</p>
                ) : (
                  <>
                    {/* Lista visual de recursos seleccionados */}
                    {formData.resources.filter(id => id).length > 0 && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <h6 className="fw-bold">Recursos seleccionados:</h6>
                        <ul className="list-group">
                          {formData.resources.filter(id => id).map((resourceId, idx) => {
                            const resourceObj = resources.find(r => r.id === resourceId);
                            return resourceObj ? (
                              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>{resourceObj.name}</div>
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-primary rounded-pill me-2">${resourceObj.cost || 0}</span>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeResource(idx)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {/* Selector de recursos */}
                    <div className="resource-selectors">
                      {formData.resources.length === 0 ? (
                        <p className="text-muted">No hay recursos seleccionados</p>
                      ) : (
                        formData.resources.map((resourceId, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <select
                              className="form-control me-2"
                              value={resourceId}
                              onChange={(e) => handleResourceChange(e, index)}
                            >
                              <option value="">Seleccionar recurso</option>
                              {resources.map((res) => (
                                <option key={res.id} value={res.id}>
                                  {res.name} (${res.cost || 0})
                                </option>
                              ))}
                            </select>
                            {/* Solo mostrar el botón para eliminar si no se muestra en la lista superior */}
                            {!resourceId && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeResource(index)}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={addResource}
                    >
                      Agregar Recurso
                    </button>
                  </>
                )}
              </div>
  
              <div className="mb-3">
                <label className="form-label">Ranger Líder</label>
                {loading.rangers ? (
                  <p className="text-muted">Cargando rangers...</p>
                ) : (
                  <>
                    <select 
                      className="form-control"
                      name="lead_ranger" 
                      value={formData.lead_ranger} 
                      onChange={handleRangerChange}
                    >
                      <option value="">Selecciona un ranger</option>
                      {rangers.map((ranger) => (
                        <option key={ranger.id} value={ranger.id}>
                          {ranger.full_name}
                        </option>
                      ))}
                    </select>
                    
                    {/* Mostrar el ranger seleccionado */}
                    {formData.lead_ranger && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <span className="fw-bold">Ranger seleccionado: </span>
                        {rangers.find(r => r.id === formData.lead_ranger)?.full_name || "Ranger no encontrado"}
                      </div>
                    )}
                  </>
                )}               
              </div>
  
              <div className="mb-3">
                <label className="form-label">
                  Pronóstico del Clima Estimado
                </label>
                <textarea
                  className="form-control"
                  name="estimated_weather_forecast"
                  value={formData.estimated_weather_forecast}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    name="trip_image_url"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cargar Imagen</label>
                  <input
                    type="file"
                    className="form-control btn-dark"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
  
              {imagePreview && (
                <div className="row mb-3">
                  <div className="col-md-12">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
  
              <button type="submit" className="btn btn-dark w-100">
                Crear Viaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip; 