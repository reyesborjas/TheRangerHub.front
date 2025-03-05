import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/CreateActivity.css";
import SideBarDashboard from "./SideBarDashboard.jsx";
import TopNavbar from "./TopNavbar.jsx";

const CreateActivity = () => {  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedDifficultyLabel, setSelectedDifficultyLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          console.log("Categorías cargadas:", categoriesData.categories);
        } else {
          console.error("Formato inesperado en categorías:", categoriesData);
        }

        // Obtener localizaciones iniciales
        const locationsResponse = await fetch(
          "https://rangerhub-back.vercel.app/locations"
        );
        const locationsData = await locationsResponse.json();
        if (Array.isArray(locationsData.locations)) {
          setLocations(locationsData.locations);
          console.log("Localizaciones cargadas:", locationsData.locations);
        } else {
          console.error("Formato inesperado en localizaciones:", locationsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar datos iniciales");
      }
    };

    fetchData();
    
    // Aplicar estilos para arreglar problemas de visualización
    const style = document.createElement('style');
    style.textContent = `
      .create-activity-container select.form-control {
        color: #333 !important;
        background-color: #fff !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
      }
      .create-activity-container select.form-control option {
        color: #333 !important;
        background-color: #fff !important;
      }
      .create-activity-container .form-control {
        color: #333 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  // Actualizar visualización cuando cambia formData
  useEffect(() => {
    if (formData.category_id && categories.length > 0) {
      const category = categories.find(cat => cat.id === formData.category_id);
      setSelectedCategoryName(category ? category.name : "");
      console.log("Categoría seleccionada:", formData.category_id, "Nombre:", category?.name);
    }
    
    if (formData.difficulty) {
      setSelectedDifficultyLabel(formData.difficulty);
      console.log("Dificultad seleccionada:", formData.difficulty);
    }
  }, [formData.category_id, formData.difficulty, categories]);

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
      console.log("Resultados de búsqueda:", data);
      setLocationResults(data.locations || []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      toast.error("Error buscando localizaciones");
    }
    setIsSearching(false);
  };

  const handleLocationSearch = (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    
    if (!query.trim()) {
      clearLocationSelection();
    } else {
      searchLocations(query);
    }
  };

  const clearLocationSelection = () => {
    setFormData(prev => ({
      ...prev,
      location_id: ""
    }));
    setSelectedLocation("");
    setLocationQuery("");
    setLocationResults([]);
  };

  const selectLocation = (location) => {
    console.log("Seleccionando localización:", location);
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
    console.log(`Campo ${name} cambiado a: ${type === "checkbox" ? checked : value}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Actualización específica para categoría
    if (name === "category_id" && value) {
      const category = categories.find(cat => cat.id === value);
      setSelectedCategoryName(category ? category.name : "");
    }

    // Actualización específica para dificultad
    if (name === "difficulty") {
      setSelectedDifficultyLabel(value);
    }
  };

  const validateForm = () => {
    // Validaciones de campos requeridos
    if (!formData.name.trim()) {
      toast.error("El nombre de la actividad es requerido");
      return false;
    }
    
    if (!formData.category_id) {
      toast.error("Debes seleccionar una categoría");
      return false;
    }
    
    if (!formData.location_id) {
      toast.error("Debes seleccionar una localización");
      return false;
    }

    if (!formData.difficulty) {
      toast.error("Debes seleccionar un nivel de dificultad");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("La descripción es requerida");
      return false;
    }

    if (!formData.activity_image_url.trim()) {
      toast.error("La URL de la imagen es requerida");
      return false;
    }

    // Validaciones de campos numéricos
    if (!formData.duration || isNaN(parseFloat(formData.duration)) || parseFloat(formData.duration) <= 0) {
      toast.error("La duración debe ser un número positivo");
      return false;
    }

    if (!formData.min_participants || isNaN(parseInt(formData.min_participants)) || parseInt(formData.min_participants) < 1) {
      toast.error("El mínimo de participantes debe ser al menos 1");
      return false;
    }

    if (!formData.max_participants || isNaN(parseInt(formData.max_participants)) || parseInt(formData.max_participants) < 1) {
      toast.error("El máximo de participantes debe ser al menos 1");
      return false;
    }

    if (parseInt(formData.min_participants) > parseInt(formData.max_participants)) {
      toast.error("El mínimo de participantes no puede ser mayor que el máximo");
      return false;
    }

    if (!formData.cost || isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) < 0) {
      toast.error("El costo debe ser un número válido no negativo");
      return false;
    }

    return true;
  };

  const handleSubmit = async (actionType) => {
    if (isSubmitting) return;
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Preparar los datos manteniendo strings para los id (UUID)
      const payload = {
        ...formData,
        // Los campos numéricos ya serán convertidos por el backend
        duration: formData.duration,
        min_participants: formData.min_participants,
        max_participants: formData.max_participants,
        cost: formData.cost,
      };

      console.log("Enviando datos:", JSON.stringify(payload));

      const response = await fetch("https://rangerhub-back.vercel.app/activities", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log("Código de respuesta:", response.status);
      
      // Obtener la respuesta como texto para debugging
      const responseText = await response.text();
      console.log("Respuesta completa:", responseText);
      
      // Intentar parsear como JSON si es posible
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Error al parsear respuesta:", e);
        data = { message: responseText || "Error desconocido" };
      }

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Éxito
      toast.success("¡Actividad creada exitosamente!", {
        autoClose: 3000,
        onClose: () => {
          if (actionType === "saveAndList") {
            navigate("/secured/:username/dashboard/activities");
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
            setSelectedCategoryName("");
            setSelectedDifficultyLabel("");
            setLocationResults([]);
          }
        }
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error(error.message || "Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SideBarDashboard />
      <TopNavbar />
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
            {/* Campo: Categoría - Selector personalizado */}
            <div className="form-group mb-3">
              <label className="form-label">Categoría</label>
              <div className="dropdown w-100">
                <button 
                  className="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" 
                  type="button" 
                  id="categoryDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{border: '1px solid #ccc', padding: '0.75rem'}}
                >
                  <span>{selectedCategoryName || "Seleccione una categoría"}</span>
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button 
                        className="dropdown-item" 
                        type="button" 
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category_id: category.id }));
                          setSelectedCategoryName(category.name);
                        }}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              
            </div>

            {/* Campo: Búsqueda de Localización */}
            <div className="form-group mb-3 position-relative">
              <label className="form-label">Localización</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar localización..."
                  value={selectedLocation || locationQuery}
                  onChange={handleLocationSearch}
                  required
                />
                {selectedLocation && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={clearLocationSelection}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>

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
                min="0"
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
                min="0.5"
                required
              />
            </div>

            {/* Campo: Dificultad */}
        
<div className="form-group mb-3">
  <label className="form-label">Dificultad</label>
  <div className="dropdown w-100">
    <button 
      className="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" 
      type="button" 
      id="difficultyDropdown" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
      style={{border: '1px solid #ccc', padding: '0.75rem'}}
    >
      <span>{selectedDifficultyLabel || "Seleccionar dificultad"}</span>
      <span className="caret"></span>
    </button>
    <ul className="dropdown-menu w-100" aria-labelledby="difficultyDropdown">
      <li>
        <button 
          className="dropdown-item" 
          type="button" 
          onClick={() => {
            setFormData(prev => ({ ...prev, difficulty: "Fácil" }));
            setSelectedDifficultyLabel("Fácil");
          }}
        >
          Fácil
        </button>
      </li>
      <li>
        <button 
          className="dropdown-item" 
          type="button" 
          onClick={() => {
            setFormData(prev => ({ ...prev, difficulty: "Intermedia" }));
            setSelectedDifficultyLabel("Intermedia");
          }}
        >
          Intermedia
        </button>
      </li>
      <li>
        <button 
          className="dropdown-item" 
          type="button" 
          onClick={() => {
            setFormData(prev => ({ ...prev, difficulty: "Difícil" }));
            setSelectedDifficultyLabel("Difícil");
          }}
        >
          Difícil
        </button>
      </li>
    </ul>
  </div>
 
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
                  min={formData.min_participants || 1}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...</>
                ) : (
                  <><i className="bi bi-save me-2"></i>Guardar y Ver Listado</>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-primary btn-lg"
                onClick={() => handleSubmit("saveAndNew")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-plus-circle me-2"></i>
                )}
                Guardar y Crear Otra
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateActivity;