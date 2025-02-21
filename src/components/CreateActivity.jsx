import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateActivity.css"; 

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

  
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/activitycategory");
      const data = await response.json();
      console.log("Categorías recibidas:", data);
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.error("Se esperaba un array de categorías, pero se recibió:", data.categories);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

 
  const fetchLocations = async () => {
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/locations");
      const data = await response.json();
      console.log("Localizaciones recibidas:", data);
      if (Array.isArray(data.locations)) {
        setLocations(data.locations);
      } else {
        console.error("Se esperaba un array de localizaciones, pero se recibió:", data.locations);
      }
    } catch (error) {
      console.error("Error al obtener las localizaciones:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const payload = {
        ...formData,
        duration: parseInt(formData.duration, 10),      
        min_participants: parseInt(formData.min_participants, 10), 
        max_participants: parseInt(formData.max_participants, 10),
        cost: parseFloat(formData.cost),                
      };

      console.log("Datos enviados al backend:", payload); 

      const response = await fetch("https://rangerhub-back.vercel.app/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/activities");
      } else {
        console.error("Error al crear la actividad:", data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al crear la actividad. Por favor, inténtalo de nuevo.");
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
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-control"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Localización</label>
                <select
                  className="form-control"
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar localización</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.place_name} 
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  className="form-control"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Duración (horas)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dificultad</label>
                <select
                  className="form-control"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
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
                <input
                  type="number"
                  className="form-control"
                  name="min_participants"
                  value={formData.min_participants}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Máximo de participantes</label>
                <input
                  type="number"
                  className="form-control"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Disponible</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pública</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">URL de la imagen</label>
              <input
                type="text"
                className="form-control"
                name="activity_image_url"
                value={formData.activity_image_url}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Crear Actividad
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivity;