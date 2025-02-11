import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (formData.username === "admin" && formData.password === "1234") {
      navigate("/dashboard");
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Iniciar sesión como Ranger</h2>
        <p className="text-center text-muted">
          Solo se admite el inicio de sesión por correo electrónico o Google.
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="text"
              placeholder="Teléfono / Email"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn btn-login">
            Iniciar Sesión
          </button>

          <div className="extra-links">
            <Link to="#">Olvidaste tu contraseña?</Link>
            <Link to="/signup">Regístrate</Link>
          </div>

          <div className="separator">
            <span></span>
          </div>

          <div className="social-login">
            <button className="btn btn-google">
              <FontAwesomeIcon icon={faGoogle} /> Inicia sesión con Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
