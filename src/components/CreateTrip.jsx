import "../styles/SignUp.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBarDashboard from "./SideBarDashboard.jsx";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [rangers, setRangers] = useState([]);
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
    lead_ranger: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("https://rangerhub-back.vercel.app/activities");
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    // Fetch Rangers optimizado y corregido
    const fetchRangers = async () => {
      try {
        const response = await fetch("https://rangerhub-back.vercel.app/rangers");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error desconocido del servidor");
        }
        const data = await response.json();
        if (!data.rangers || !Array.isArray(data.rangers)) {
          throw new Error("Formato de respuesta inválido");
        }
        setRangers(data.rangers);
      } catch (error) {
        console.error("Error fetching rangers:", error);
        alert(error.message);
        setRangers([]);
      }
    };

    fetchActivities();
    fetchRangers();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "start_date" || name === "end_date") {
      value += "T00:00:00Z";
    }

    if (["participants_number", "total_cost"].includes(name)) {
      value = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivityChange = (e, index) => {
    const newValue = e.target.value;
    // Validar duplicados: se ignoran valores vacíos
    if (newValue && formData.activities.some((act, i) => i !== index && act === newValue)) {
      alert("Esta actividad ya está seleccionada. Por favor, elige otra.");
      return;
    }
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = newValue;
    setFormData({ ...formData, activities: updatedActivities });
  };

  const addActivity = () => {
    setFormData({ ...formData, activities: [...formData.activities, ""] });
  };

  const removeActivity = (index) => {
    const updatedActivities = [...formData.activities];
    updatedActivities.splice(index, 1);
    setFormData({ ...formData, activities: updatedActivities });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, trip_image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
  
      // Enviar datos básicos del viaje
      const tripResponse = await fetch("https://rangerhub-back.vercel.app/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          activities: undefined, // Excluir actividades del payload
        }),
      });
  
      const { id: tripId } = await tripResponse.json();
  
      // Enviar actividades en paralelo con control de errores
      const results = await Promise.allSettled(
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
  
      // Verificar errores en actividades
      const failedActivities = results.filter(r => r.status === "rejected");
      if (failedActivities.length > 0) {
        throw new Error(`${failedActivities.length} actividades no se pudieron asociar`);
      }
  
      navigate("/dashboard/trips");
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <SideBarDashboard />
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
                  <label className="form-label">Número de Participantes</label>
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
                  <input
                    type="number"
                    className="form-control"
                    name="total_cost"
                    onChange={handleChange}
                    required
                  />
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

              <div className="mb-3">
                <label className="form-label">Actividades</label>
                {formData.activities.map((activity, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <select
                      className="form-control me-2"
                      value={activity}
                      onChange={(e) => handleActivityChange(e, index)}
                      required
                    >
                      <option value="">Seleccionar actividad</option>
                      {activities.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeActivity(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addActivity}
                >
                  Agregar Actividad
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">Ranger Líder</label>
                <select
                  className="form-control"
                  name="lead_ranger"
                  value={formData.lead_ranger}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Ranger</option>
                  {Array.isArray(rangers) &&
                    rangers.map((ranger) => (
                      <option key={ranger.id} value={ranger.id}>
                        {ranger.full_name} (@{ranger.username})
                      </option>
                    ))}
                </select>
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
