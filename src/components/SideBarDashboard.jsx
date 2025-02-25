import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/SideBarDashboard.css";

const SideBarDashboard = () => {
    const { username } = useParams(); // Obtenemos el username de la URL
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
                    throw new Error('Error al obtener datos del clima');
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
            <div className="logo">
                <img src={logo} alt="The Ranger Hub" />
            </div>

            {/* Botón para nuevo viaje utilizando Link y la ruta dinámica */}
            <Link to={`/secured/${username}/dashboard/createtrip`} className="new-trip-btn">
                + Nuevo Viaje
            </Link>

            <nav className="nav flex-column w-100">
                <Link to={`/secured/${username}/dashboard/home`} className="nav-link">
                    <i className="fas fa-home"></i> Inicio
                </Link>
                <Link to={`/secured/${username}/dashboard/mytrips`} className="nav-link">
                    <i className="fas fa-suitcase"></i> Mis Viajes
                </Link>
                <Link to={`/secured/${username}/dashboard/trips`} className="nav-link">
                    <i className="fas fa-map"></i> Viajes
                </Link>
                <Link to={`/secured/${username}/dashboard/activities`} className="nav-link">
                    <i className="fas fa-bicycle"></i> Actividades
                </Link>
                <Link to={`/secured/${username}/dashboard/resources`} className="nav-link">
                    <i className="fas fa-book"></i> Recursos
                </Link>
            </nav>

            <div className="weather">
                {error ? (
                    <p>Error al cargar el clima</p>
                ) : weather && weather.main ? (
                    <>
                        <i className="fas fa-cloud-sun"></i>
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

            <div className="bottom-icons d-flex">
                <Link to="/ayuda" className="icon-btn">
                    <i className="fas fa-question-circle"></i>
                </Link>
                <Link to="/configuracion" className="icon-btn">
                    <i className="fas fa-cog"></i>
                </Link>
            </div>
        </div>
    );
};

export default SideBarDashboard;
