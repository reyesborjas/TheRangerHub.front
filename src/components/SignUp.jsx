import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../components/Navbar";
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    nationality: "",
    rut: "",
    passport_number: "",
    biography: "",
    role_id: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/roles");
      const data = await response.json();
      const filteredRoles = data.roles.filter((role) => role.role_name !== "admin");
      setRoles(filteredRoles);
    } catch (error) {
      console.error("Error loading roles:", error);
      setSubmitError("Error al cargar los roles. Por favor, intente nuevamente.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    }
    
    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingrese un email válido";
    }
    
    // RUT validation (optional)
    if (formData.rut && !/^[0-9]{7,8}-[0-9kK]{1}$/.test(formData.rut)) {
      newErrors.rut = "Formato de RUT inválido (ej: 12345678-9)";
    }
    
    // Role validation
    if (!formData.role_id) {
      newErrors.role_id = "Por favor seleccione un rol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to login page on success
        navigate("/login");
      } else {
        setSubmitError(data.message || "Error en el registro. Por favor, intente nuevamente.");
      }
    } catch (error) {
      setSubmitError("Error de conexión. Por favor, verifique su conexión a internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MyNavbar />
      <div className="container signup-container" > 
        <div className="content-container">
          <div className="card p-4 shadow-lg signup-box-2 col-md-12" >
            
            <h2 className="text-center">Registro de Usuario</h2>
            
            {submitError && (
              <div className="alert alert-danger" role="alert">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label className="form-label">Nombre de Usuario *</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Nacionalidad *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">RUT </label>
                  <input
                    type="text"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    placeholder="12345678-9"
                  />
                  {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Número de Pasaporte </label>
                  <input
                    type="text"
                    className="form-control"
                    name="passport_number"
                    value={formData.passport_number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Biografía (opcional)</label>
                <textarea
                  className="form-control"
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rol *</label>
                {errors.role_id && <div className="text-danger mb-2">{errors.role_id}</div>}
                {roles.map((role) => (
                  <div key={role.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role_id"
                      value={role.id}
                      checked={formData.role_id === role.id.toString()}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{role.role_name}</label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </button>
            </form>

            <div className="extra-links">
              <p className="login">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;