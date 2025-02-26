import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import MyNavbar from "./Navbar";

import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar error previo

    try {
      const response = await fetch("https://rangerhub-back.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Ocurrió un error en login");
      
      if (!data.token) {
        throw new Error("No se recibió un token de autenticación");
      }
      
      localStorage.setItem("token", data.token);
      
      // Si tienes datos de usuario, guárdalos también
      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }
      
      // Asegúrate de que utilizas la propiedad correcta para la navegación
      navigate(`/secured/${data.username || formData.username}/dashboard/home`);
      
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <MyNavbar />
      <div className="login-container">
        <div className="card p-4 shadow-lg login-box">
          <h2 className="text-center">Iniciar Sesión</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100">Ingresar</button>
          </form>

          <div className="extra-links text-center mt-3">
            <p>¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;