import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/SideBarDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faSuitcase, faMap, faBicycle, faBook,
  faCloudSun, faCog, faQuestionCircle, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const SideBarDashboard = () => {
  const { username } = useParams();
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

        if (!response.ok) throw new Error("Error al obtener datos del clima");
        
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
      <Link 
        to={`/secured/${username}/dashboard/createtrip`} 
        className="new-trip-btn"
      >
        + Nuevo Viaje
      </Link>

      {/* Navegación principal */}
      <nav className="nav flex-column w-100">
        <Link 
          to={`/secured/${username}/dashboard/home`} 
          className="nav-link"
        >
          <FontAwesomeIcon icon={faHome} /> Inicio
        </Link>
        <Link 
          to={`/secured/${username}/dashboard/mytrips`} 
          className="nav-link"
        >
          <FontAwesomeIcon icon={faSuitcase} /> Mis Viajes
        </Link>
        <Link 
          to={`/secured/${username}/dashboard/trips`} 
          className="nav-link"
        >
          <FontAwesomeIcon icon={faMap} /> Viajes
        </Link>
        <Link 
          to={`/secured/${username}/dashboard/activities`} 
          className="nav-link"
        >
          <FontAwesomeIcon icon={faBicycle} /> Actividades
        </Link>
        <Link 
          to={`/secured/${username}/dashboard/resources`} 
          className="nav-link"
        >
          <FontAwesomeIcon icon={faBook} /> Recursos
        </Link>
      </nav>

      {/* Sección del clima */}
      <div className="weather text-center">
        {error ? (
          <p>Error al cargar el clima</p>
        ) : weather?.main ? (
          <>
            <FontAwesomeIcon icon={faCloudSun} size="2x" />
            <p>{weather.name}</p>
            <h4>{Math.round(weather.main.temp)}°C</h4>
            {weather.weather?.[0]?.description && (
              <small>{weather.weather[0].description}</small>
            )}
          </>
        ) : (
          <p>Cargando clima...</p>
        )}
      </div>

      {/* Iconos inferiores */}
      <div className="bottom-icons d-flex justify-content-center mt-3">
        <Link to="/ayuda" className="sidebar-icon">
          <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
        </Link>
        <Link 
          to={`/secured/${username}/configuracion`} 
          className="sidebar-icon"
        >
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