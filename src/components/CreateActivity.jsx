import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateActivity.css"; // Asegúrate de crear este archivo CSS

const CreateActivity = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    location_id: "",
    name: "",
    description: "",
    duration: "",
    difficulty: "",
    min_participants: "",
    max_participants: "",
    is_available: true,
    is_public: true,
    cost: "",
    activity_image_url: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const response = await fetch("https://rangerhub-back.vercel.app/activitycategory");
          const data = await response.json();
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else {
            console.error("Expected an array of categories, but got:", data.categories);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      
      const fetchLocations = async () => {
        try {
          const response = await fetch("https://rangerhub-back.vercel.app/locations");
          const data = await response.json();
          if (Array.isArray(data.locations)) {
            setLocations(data.locations);
          } else {
            console.error("Expected an array of locations, but got:", data.locations);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };
      
    fetchCategories();
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Manejar checkboxes para is_available y is_public
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/activities"); // Redirigir a la lista de actividades después de crear una
      } else {
        console.error("Error al crear la actividad:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container create-activity-container">
      <div className="content-container col-md-12">
        <div className="card p-4 shadow-lg create-activity-box">
          <h2 className="text-center">Crear Actividad</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="name" onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select className="form-control" name="category_id" onChange={handleChange} required>
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Localización</label>
                <select className="form-control" name="location_id" onChange={handleChange} required>
                  <option value="">Seleccionar localización</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Costo</label>
                <input type="number" className="form-control" name="cost" onChange={handleChange} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Duración (horas)</label>
                <input type="number" className="form-control" name="duration" onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dificultad</label>
                <select className="form-control" name="difficulty" onChange={handleChange} required>
                  <option value="">Seleccionar dificultad</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Mínimo de participantes</label>
                <input type="number" className="form-control" name="min_participants" onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Máximo de participantes</label>
                <input type="number" className="form-control" name="max_participants" onChange={handleChange} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Disponible</label>
                <input type="checkbox" className="form-check-input" name="is_available" checked={formData.is_available} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pública</label>
                <input type="checkbox" className="form-check-input" name="is_public" checked={formData.is_public} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="description" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">URL de la imagen</label>
              <input type="text" className="form-control" name="activity_image_url" onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-dark w-100">Crear Actividad</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivity;