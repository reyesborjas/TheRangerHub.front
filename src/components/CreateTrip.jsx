import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBarDashboard from "./SideBarDashboard.jsx";
import TopNavbar from "./TopNavbar.jsx";
import "../styles/CreateTrip.css";

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

    // Ajusta fecha para incluir "T00:00:00Z"
    if (name === "start_date" || name === "end_date") {
      value += "T00:00:00Z";
    }

    // Convierte participantes y costo a número
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

    if (
      formData.activities.length === 0 ||
      formData.activities.some((a) => !a)
    ) {
      alert("Selecciona al menos una actividad válida");
      return;
    }

    try {
      const activitiesList = formData.activities;
      const tripData = { ...formData };
      delete tripData.activities;

      // Crear viaje
      const tripResponse = await fetch("https://rangerhub-back.vercel.app/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tripData,
          lead_ranger: formData.lead_ranger,
        }),
      });

      if (!tripResponse.ok) {
        const errorData = await tripResponse.json();
        throw new Error(errorData.message || "Error al crear el viaje");
      }

      const tripDataResponse = await tripResponse.json();
      const tripId = tripDataResponse.id;

      // Relacionar actividades con el viaje
      await Promise.all(
        activitiesList.map((activityId) =>
          fetch("https://rangerhub-back.vercel.app/activity-trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trip_id: tripId, activity_id: activityId }),
          }).then((res) => {
            if (!res.ok)
              throw new Error("Error creando relación con actividad");
            return res.json();
          })
        )
      );

      navigate("/trips");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error al crear el viaje: " + error.message);
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

                {/* Participantes y Costo */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Número de Participantes</label>
                    <input
                        type="number"
                        className="form-control"
                        name="participants_number"
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Costo Total</label>
                    <input
                        type="number"
                        className="form-control"
                        name="total_cost"
                        onChange={handleChange}
                        required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción</label>
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

                {/* URL e Imagen */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">URL de Imagen</label>
                    <input
                        type="text"
                        className="form-control"
                        name="trip_image_url"
                        onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Cargar Imagen</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Vista previa de la imagen */}
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

                {/* Botón para crear viaje */}
                <button type="submit" className="btn btn-create-trip w-100">
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
