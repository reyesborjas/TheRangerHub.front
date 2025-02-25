import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import "../styles/SideBarDashboard.css";

// Importar FontAwesome para los iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome, faSuitcase, faMap, faBicycle, faBook,
    faCloudSun, faCog, faQuestionCircle, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const SideBarDashboard = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const city = "Santiago";

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const API_KEY = "5964187f2c4fe2e969d1914fd73c56ec";
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
                );

                if (!response.ok) {
                    throw new Error("Error al obtener datos del clima");
                }

                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching weather:", err);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="sidebar d-flex flex-column align-items-center">
            {/* Logo */}
            <div className="logo">
                <img src={logo} alt="The Ranger Hub" />
            </div>

            {/* Botón de Nuevo Viaje */}
            <button className="new-trip-btn" onClick={() => window.location.href = "/dashboard/Page1"}>
                + Nuevo Viaje
            </button>


                <nav className="nav flex-column w-100">
                    <a href="/inicio" className="nav-link">
                        <i className="fas fa-home"></i> Inicio
                    </a>
                    <a href="/mis-viajes" className="nav-link">
                        <i className="fas fa-suitcase"></i> Mis Viajes
                    </a>
                    <a href="/viajes" className="nav-link">
                        <i className="fas fa-map"></i> Viajes
                    </a>
                    <a href="/actividades" className="nav-link">
                        <i className="fas fa-bicycle"></i> Actividades
                    </a>
                    <a href="/recursos" className="nav-link">
                        <i className="fas fa-book"></i> Recursos
                    </a>
                </nav>

            {/* Clima */}
            <div className="weather text-center">
                {error ? (
                    <p>Error al cargar el clima</p>
                ) : weather && weather.main ? (
                    <>
                        <FontAwesomeIcon icon={faCloudSun} size="2x" />
                        <p>{weather.name}</p>
                        <h4>{Math.round(weather.main.temp)}°C</h4>
                        {weather.weather && weather.weather[0] && (
                            <small>{weather.weather[0].description}</small>
                        )}
                    </>
                ) : (
                    <p>Cargando clima...</p>
                )}
            </div>

            {/* Iconos Inferiores */}
            <div className="bottom-icons d-flex justify-content-center mt-3">
                <Link to="/ayuda" className="sidebar-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
                </Link>
                <Link to="/configuracion" className="sidebar-icon">
                    <FontAwesomeIcon icon={faCog} size="lg" />
                </Link>
                <Link to="/" className="sidebar-icon">
                    <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                </Link>
            </div>
        </div>
    );
};

export default SideBarDashboard;