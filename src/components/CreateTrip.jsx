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
    estimated_weather_forecast: "Temperatura mínima:  Temperatura máxima: Expectativas de lluvias (si/no): ",
    description: "",
    total_cost: "",
    trip_image_url: "",
    activities: [],
    lead_ranger: [],
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
        const data = await response.json();
        console.log(data);
        setRangers(data.rangers || []);
      } catch (error) {
        console.error("Error fetching rangers:", error);
      }
    };

    fetchActivities();
    fetchRangers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      if (response.ok) {
        navigate("/trips");
      } else {
        console.error("Error al crear el viaje:", data.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error:", error);
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
                    <input type="text" className="form-control" name="trip_name" onChange={handleChange} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha de Inicio</label>
                    <input type="date" className="form-control" name="start_date" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha de Fin</label>
                    <input type="date" className="form-control" name="end_date" onChange={handleChange} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Número de Participantes</label>
                    <input type="number" className="form-control" name="participants_number" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Costo Total</label>
                    <input type="number" className="form-control" name="total_cost" onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="description" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Actividades</label>
                  {formData.activities.map((activity, index) => (
                      <select
                          key={index}
                          className="form-control mb-2"
                          value={activity}
                          onChange={(e) => handleActivityChange(e, index)}
                          required
                      >
                        <option value="">Seleccionar actividad</option>
                        {Array.isArray(activities) && activities.length > 0 ? (
                            activities.map((act) => (
                                <option key={act.id} value={act.id}>{act.name}</option>
                            ))
                        ) : (
                            <option disabled>Cargando actividades...</option>
                        )}
                      </select>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addActivity}>Agregar Actividad</button>
                </div>

                <div className="mb-3">
                  <label className="form-label">Ranger Líder</label>
                  <select className="form-control" name="lead_ranger" onChange={handleChange} required>
                    <option value="">Seleccionar Ranger</option>
                    {Array.isArray(rangers) && rangers.length > 0 ? (
                      rangers.map((ranger) => (
                        <option key={ranger.uuid} value={ranger.uuid}>
                          {ranger.full_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Cargando rangers...</option>
                    )}
                  </select>
                </div>

            <div className="mb-3">
              <label className="form-label">Pronóstico del Clima Estimado</label>
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
                    <input type="text" className="form-control" name="trip_image_url" onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cargar Imagen</label>
                    <input type="file" className="form-control btn-dark" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>

                {imagePreview && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <img src={imagePreview} alt="Vista previa" className="img-fluid rounded" style={{ maxHeight: "200px", objectFit: "cover" }} />
                      </div>
                    </div>
                )}

                <button type="submit" className="btn btn-dark w-100">Crear Viaje</button>
              </form>
            </div>
          </div>
        </div>
      </>
  );
};

export default CreateTrip;
