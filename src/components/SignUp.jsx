import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import "../styles/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    ususario: "",
    email: "",
    nacionalidad: "",
    rut: "",
    pasaporte: "",
    role: "",
    biografía: "",
    experiencia: "",
    especialidad: "",
    routeType: [],
    disponibilidad: "",
    visibilidad: "yes",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      routeType: checked
        ? [...prev.routeType, value]
        : prev.routeType.filter((route) => route !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
  };

  return (
    <div className="container signup-container"> 
      <div className="content-container">
        <div className="card p-4 shadow-lg signup-box">
          <h2 className="text-center">Registro de Usuario</h2>

          <form onSubmit={handleSubmit}>
            {/* Nombre de Usuario y Email */}
            <div className="mb-3">
              <label className="form-label">Nombre de Usuario</label>
              <input type="text" className="form-control" name="username" placeholder="Ingrese su nombre de usuario" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" placeholder="Ingrese su email" onChange={handleChange} />
            </div>

            {/* Cargar Foto de Perfil */}
            <div className="mb-3">
              <label className="form-label">Foto de perfil</label>
              <div className="d-flex align-items-center">
                <label htmlFor="file-upload" className="btn btn-outline-secondary me-3">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Cargar foto
                </label>
                <input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} />
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="name" placeholder="Ingrese su nombre" />
              </div>
              <div className="col">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" name="lastname" placeholder="Ingrese su apellido" />
              </div>
            </div>

            {/* Nacionalidad */}
            <div className="mb-3">
              <label className="form-label">Nacionalidad</label>
              <input type="text" className="form-control" name="nationality" placeholder="Ingrese su nacionalidad" />
            </div>

            {/* RUT y Pasaporte */}
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">R.U.T</label>
                <input type="text" className="form-control" name="rut" placeholder="Ingrese su RUT" />
              </div>
              <div className="col">
                <label className="form-label">Pasaporte</label>
                <input type="text" className="form-control" name="passport" placeholder="Ingrese su pasaporte" />
              </div>
            </div>

            {/* ¿Eres Ranger o Explorador? */}
            <div className="mb-3">
              <label className="form-label">¿Eres Ranger o Explorador?</label>
              <div className="d-flex">
                <div className="form-check me-3">
                  <input className="form-check-input" type="radio" name="role" value="Ranger" onChange={handleChange} />
                  <label className="form-check-label">Ranger</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" value="Explorador" onChange={handleChange} />
                  <label className="form-check-label">Explorador</label>
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div className="mb-3">
              <label className="form-label">Biografía</label>
              <textarea className="form-control" rows="3" name="bio" placeholder="Cuéntanos sobre ti"></textarea>
            </div>

            <div className="extra-links text-center mt-3">
              <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
            </div>

            {/* Botones de Registro */}
            <div className="d-grid gap-2 mb-4">
              <button className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={faGoogle} className="me-2" />
                Registrar con Google
              </button>
              {/* <button className="btn btn-outline-primary d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={faFacebook} className="me-2" />
                Registrar con Facebook
              </button> */}
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;