import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const MyNavbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="The Ranger Hub" className="navbar-logo img-fluid me-2" />
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
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about-us">
                                Sobre Nosotros
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact-us">
                                Contáctanos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/blog-home">
                                Blog
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        {isAuthenticated && (
                            <li className="nav-item me-3">
                                <Link className="nav-link nav-dashboard" to="/secured/:username/dashboard/home">
                                    Ir al Dashboard
                                </Link>
                            </li>
                        )}
                        <li className="nav-item">
                            {isAuthenticated ? (
                                <button
                                    className="btn btn-outline-danger login-button"
                                    onClick={handleLogout}
                                >
                                    Cerrar Sesión
                                </button>
                            ) : (
                                <Link to="/login" className="btn btn-outline-danger login-button">
                                    Iniciar Sesión
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MyNavbar;