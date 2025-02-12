import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data = await response.json();
      localStorage.setItem("token", data.token); // Guardar token de sesión
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4 shadow-lg login-box">
        <h2 className="text-center">Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
              <input type="text" className="form-control" name="username" onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
              <input type="password" className="form-control" name="password" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">Ingresar</button>
        </form>

        <div className="extra-links text-center mt-3">
          <p>¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
