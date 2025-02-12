import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // 
import "../styles/SignUp.css";


const SignUp = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
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
    fetch("https://rangerhub-back.vercel.app/roles")
      .then((response) => response.json())
      .then((data) => {
        const filteredRoles = data.roles.filter((role) => role.role_name !== "admin");
        setRoles(filteredRoles);
      })
      .catch((error) => console.error("Error al cargar roles:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, role_id: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          nationality: formData.nationality,
          rut: formData.rut,
          passport_number: formData.passport_number,
          role_id: formData.role_id,
          biography: formData.biography,
          email: formData.email,
          password: formData.password, // No hashees aquí, el backend lo hace
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        console.log("Registro exitoso:", data);
        // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
      } else {
        console.error("Error en el registro:", data.message);
        // Mostrar error en la interfaz si es necesario
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container signup-container">
      <div className="content-container">
        <div className="card p-4 shadow-lg signup-box">
          <h2 className="text-center">Registro de Usuario</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre de Usuario</label>
              <input type="text" className="form-control" name="username" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              {roles.map((role) => (
                <div key={role.id} className="form-check">
                  <input className="form-check-input" type="radio" name="role_id" value={role.id} onChange={handleCheckboxChange} />
                  <label className="form-check-label">{role.role_name}</label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-dark w-100">Registrar</button>
          </form>

          <div className="extra-links text-center mt-3">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
