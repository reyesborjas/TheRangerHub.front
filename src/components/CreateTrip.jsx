import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    destination: "",
    user_id: "", // Debería obtenerse del contexto de autenticación
    trip_status: "pending",
    participants_number: "",
    estimated_weather_forecast: "",
    total_cost: "",
    trip_image_url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      if (response.ok) {
        console.log("Viaje creado exitosamente:", data);
        navigate("/trips"); // Redirigir a la página de viajes
      } else {
        console.error("Error al crear el viaje:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container signup-container">
      <div className="content-container">
        <div className="card p-4 shadow-lg signup-box">
          <h2 className="text-center">Crear Viaje</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input type="text" className="form-control" name="title" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="description" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de Inicio</label>
              <input type="date" className="form-control" name="start_date" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de Fin</label>
              <input type="date" className="form-control" name="end_date" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Destino</label>
              <input type="text" className="form-control" name="destination" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Número de Participantes</label>
              <input type="number" className="form-control" name="participants_number" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Pronóstico Estimado</label>
              <input type="text" className="form-control" name="estimated_weather_forecast" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Costo Total</label>
              <input type="number" className="form-control" name="total_cost" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">URL de Imagen</label>
              <input type="text" className="form-control" name="trip_image_url" onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-dark w-100">Crear Viaje</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;