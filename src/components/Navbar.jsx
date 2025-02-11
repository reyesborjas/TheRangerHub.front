import React from "react";
import { Link } from "react-router-dom"; // Para la navegación sin recargar la página
import logo from "../assets/logo.png";

const MyNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm fixed-top">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" width="120" />
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
<<<<<<< HEAD
                            <Link className="nav-link" to="/about-us">Sobre Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact-us">Contáctanos</Link>
=======
                            <Link className="nav-link" to="/AboutUs">Sobre nosostros</Link>
>>>>>>> clara
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                role="button"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Explora Más
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#">Acción</a></li>
                                <li><a className="dropdown-item" href="#">Otra acción</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Algo más aquí</a></li>
                            </ul>
                        </li>
                    </ul>

                    {/* Botón de Iniciar Sesión con navegación a /login */}
                    <form className="d-flex ms-auto">
                        <Link to="/login" className="btn btn-outline-dark">Iniciar Sesión</Link>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default MyNavbar;