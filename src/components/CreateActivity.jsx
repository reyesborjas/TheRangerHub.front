import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/CreateActivity.css";


const CreateActivity = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

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

  // Obtener categorías y localizaciones iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesResponse = await fetch(
          "https://rangerhub-back.vercel.app/activitycategory"
        );
        const categoriesData = await categoriesResponse.json();
        if (Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        }

        // Obtener localizaciones iniciales
        const locationsResponse = await fetch(
          "https://rangerhub-back.vercel.app/locations"
        );
        const locationsData = await locationsResponse.json();
        if (Array.isArray(locationsData.locations)) {
          setLocations(locationsData.locations);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Buscar localizaciones
  const searchLocations = async (query) => {
    if (query.length < 2) {
      setLocationResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://rangerhub-back.vercel.app/locations?search=${query}`
      );
      const data = await response.json();
      setLocationResults(data.locations || []);
    } catch (error) {
      toast.error("Error buscando localizaciones");
    }
    setIsSearching(false);
  };

  const handleLocationSearch = (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    searchLocations(query);
  };

  const selectLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      location_id: location.id
    }));
    setSelectedLocation(location.place_name);
    setLocationQuery("");
    setLocationResults([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (actionType) => {
    try {
      // Validación básica
      if (!formData.location_id) {
        toast.error("Debes seleccionar una localización");
        return;
      }

      const payload = {
        ...formData,
        duration: parseFloat(formData.duration),
        min_participants: parseInt(formData.min_participants, 10),
        max_participants: parseInt(formData.max_participants, 10),
        cost: parseFloat(formData.cost),
      };

      const response = await fetch("https://rangerhub-back.vercel.app/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Actividad creada exitosamente!", {
          autoClose: 3000,
          onClose: () => {
            if (actionType === "saveAndList") {
              navigate("/dashboard/activities");
            } else {
              // Resetear formulario
              setFormData({
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
              setSelectedLocation("");
              setLocationResults([]);
            }
          }
        });
      } else {
        toast.error(data.message || "Error al crear actividad");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container create-activity-container">
      <ToastContainer position="top-center" />
      
      <div className="card p-4 shadow-lg create-activity-box">
        <h2 className="text-center mb-4">Crear Nueva Actividad</h2>
        
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Campo: Nombre */}
          <div className="form-group mb-3">
            <label className="form-label">Nombre de la Actividad</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo: Categoría */}
          <div className="form-group mb-3">
            <label className="form-label">Categoría</label>
            <select
              className="form-control"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Búsqueda de Localización */}
          <div className="form-group mb-3 position-relative">
            <label className="form-label">Localización</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar localización..."
              value={selectedLocation || locationQuery}
              onChange={handleLocationSearch}
              required
            />
            
            {locationResults.length > 0 && (
              <div className="location-results">
                {locationResults.map((location) => (
                  <div
                    key={location.id}
                    className="location-item"
                    onClick={() => selectLocation(location)}
                  >
                    <div className="fw-bold">{location.place_name}</div>
                    <small>{location.country}, {location.province}</small>
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && (
              <div className="search-loading text-muted mt-1">
                <small>Buscando localizaciones...</small>
              </div>
            )}
          </div>

          {/* Campo: Costo */}
          <div className="form-group mb-3">
            <label className="form-label">Costo (USD)</label>
            <input
              type="number"
              className="form-control"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          {/* Campo: Duración */}
          <div className="form-group mb-3">
            <label className="form-label">Duración (horas)</label>
            <input
              type="number"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              step="0.5"
              required
            />
          </div>

          {/* Campo: Dificultad */}
          <div className="form-group mb-3">
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

          {/* Campos: Participantes */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Mínimo de participantes</label>
              <input
                type="number"
                className="form-control"
                name="min_participants"
                value={formData.min_participants}
                onChange={handleChange}
                min="1"
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
                min={formData.min_participants}
                required
              />
            </div>
          </div>

          {/* Campos: Checkboxes */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  id="availableCheck"
                />
                <label className="form-check-label" htmlFor="availableCheck">
                  Disponible
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  id="publicCheck"
                />
                <label className="form-check-label" htmlFor="publicCheck">
                  Pública
                </label>
              </div>
            </div>
          </div>

          {/* Campo: Descripción */}
          <div className="form-group mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* Campo: URL Imagen */}
          <div className="form-group mb-4">
            <label className="form-label">URL de la imagen</label>
            <input
              type="url"
              className="form-control"
              name="activity_image_url"
              value={formData.activity_image_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>

          {/* Botones de Acción */}
          <div className="d-grid gap-3 d-md-flex justify-content-md-end">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => handleSubmit("saveAndList")}
            >
              <i className="bi bi-save me-2"></i>
              Guardar y Ver Listado
            </button>
            
            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={() => handleSubmit("saveAndNew")}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Guardar y Crear Otra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;