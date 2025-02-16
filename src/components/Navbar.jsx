import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";


const MyNavbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si hay un token en localStorage
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token de sesión
        setIsAuthenticated(false);
        navigate("/"); // Redirige al inicio
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about-us">Sobre Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact-us">Contáctanos</Link>
                        </li>
                    </ul>

                    {/* Botón de Login/Logout */}
                    <form className="d-flex ms-auto">
                        {isAuthenticated ? (
                            <button className="btn btn-outline-danger login-button" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline-danger login-button">
                                Iniciar Sesión
                            </Link>
                        )}
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default MyNavbar;
