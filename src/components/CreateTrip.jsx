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

    const fetchRangers = async () => {
      try {
        const response = await fetch("https://rangerhub-back.vercel.app/rangers");
        if (!response.ok) throw new Error("Error obteniendo rangers");

        const data = await response.json();
        // Mapeamos a un formato legible para el select
        setRangers(
            data.rangers.map((r) => ({
              uuid: r.uuid,
              label: `${r.full_name} (@${r.username})`,
            }))
        );
      } catch (error) {
        console.error("Error fetching rangers:", error);
        alert(error.message);
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
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = e.target.value;
    setFormData({ ...formData, activities: updatedActivities });
  };

  const addActivity = () => {
    setFormData({ ...formData, activities: [...formData.activities, ""] });
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

    if (formData.activities.length === 0 || formData.activities.some((a) => !a)) {
      alert("Selecciona al menos una actividad válida");
      return;
    }

    try {
      const activities = formData.activities;
      const tripData = { ...formData };
      delete tripData.activities;

      // Crear viaje
      const tripResponse = await fetch("https://rangerhub-back.vercel.app/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (!tripResponse.ok) {
        const errorData = await tripResponse.json();
        throw new Error(errorData.message || "Error al crear el viaje");
      }

      const { id: tripId } = await tripResponse.json();

      // Relacionar actividades con el viaje
      await Promise.all(
          activities.map((activityId) =>
              fetch("https://rangerhub-back.vercel.app/activity-trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trip_id: tripId, activity_id: activityId }),
              }).then((res) => {
                if (!res.ok) throw new Error("Error creando relación con actividad");
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
        <TopNavbar />
        <div className="container create-trip-container">
          <div className="content-container">
            <div className="card p-4 shadow create-trip-box">
              <h2 className="text-center mb-4 create-trip-title">Crear Viaje</h2>

              <form onSubmit={handleSubmit}>
                {/* Título */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        name="trip_name"
                        onChange={handleChange}
                        required
                    />
                  </div>
                </div>

                {/* Fechas */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Fecha de Fin</label>
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

                {/* Actividades */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Actividades</label>
                  {formData.activities.map((activity, index) => (
                      <select
                          key={index}
                          className="form-control mb-2"
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
                  ))}
                  <button
                      type="button"
                      className="btn btn-add-activity"
                      onClick={addActivity}
                  >
                    Agregar Actividad
                  </button>
                </div>

                {/* Ranger Líder */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Ranger Líder</label>
                  <select
                      className="form-control"
                      name="lead_ranger"
                      value={formData.lead_ranger}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Seleccionar Ranger</option>
                    {rangers.map((ranger) => (
                        <option key={ranger.uuid} value={ranger.uuid}>
                          {ranger.label}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Pronóstico */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Pronóstico del Clima Estimado</label>
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