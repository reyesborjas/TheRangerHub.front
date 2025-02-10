import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate()

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
    roles: [],
    role_id: "",
  });

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/roles")
      .then((response) => response.json())
      .then((responseConverted) => {
        setFormData({
          ...formData,
          roles: responseConverted.roles.filter((e) => e.role_name !== "admin"),
        });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, role_id: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);

    fetch("https://rangerhub-back.vercel.app/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(responseConverted => {
        alert("Usuario creado correctamente");
        navigate("/login");
      });
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
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Ingrese su nombre de usuario"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password de Usuario</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Ingrese su password de usuario"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Ingrese su email"
                onChange={handleChange}
              />
            </div>

            {/* Cargar Foto de Perfil
            <div className="mb-3">
              <label className="form-label">Foto de perfil</label>
              <div className="d-flex align-items-center">
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline-secondary me-3"
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Cargar foto
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            </div> */}

            {/* Nombre y Apellido */}
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Ingrese su nombre"
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Ingrese su apellido"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Nacionalidad */}
            <div className="mb-3">
              <label className="form-label">Nacionalidad</label>
              <input
                type="text"
                className="form-control"
                name="nationality"
                placeholder="Ingrese su nacionalidad"
                onChange={handleChange}
              />
            </div>

            {/* RUT y Pasaporte */}
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">R.U.T</label>
                <input
                  type="text"
                  className="form-control"
                  name="rut"
                  placeholder="Ingrese su RUT"
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Pasaporte</label>
                <input
                  type="text"
                  className="form-control"
                  name="passport_number"
                  placeholder="Ingrese su pasaporte"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ¿Eres Ranger o Explorador? */}
            <div className="mb-3">
              <label className="form-label">¿Eres Ranger o Explorador?</label>
              {formData?.roles.map((role) => (
                <div className="form-check me-3" key={role.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    value={role.id}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label">{role.role_name}</label>
                </div>
              ))}
            </div>

            {/* Biografía */}
            <div className="mb-3">
              <label className="form-label">Biografía</label>
              <textarea
                className="form-control"
                rows="3"
                name="biography"
                placeholder="Cuéntanos sobre ti"
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="extra-links text-center mt-3">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login">Inicia sesión aquí</Link>
              </p>
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
