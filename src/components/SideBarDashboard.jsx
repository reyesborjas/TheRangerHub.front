import React, {useState, useEffect} from 'react';
import logo from "../assets/logo.png";
import "../styles/SideBarDashboard.css";

const SideBarDashboard = () => {

    const [weather, setWeather] = useState(null);
    const city = "Santiago"; // Puedes cambiar la ciudad

    useEffect(() => {
        const API_KEY = "TU_API_KEY"; // Usa tu clave de OpenWeatherMap
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`)
            .then((response) => response.json())
            .then((data) => setWeather(data));
    }, []);
    return (
        <>
            <div className="sidebar d-flex flex-column align-items-center">
                {/* Logo */}
                <div className="logo">
                    <img src={logo} alt="The Ranger Hub" />
                </div>

                {/* Botón Nuevo Viaje */}
                <button className="new-trip-btn">+ Nuevo Viaje</button>

                {/* Menú de Navegación */}
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
                <div className="weather">
                    {weather ? (
                        <>
                            <i className="fas fa-cloud-sun"></i>
                            <p>{weather.name}</p>
                            <h4>{weather.main.temp}°C</h4>
                            <small>{weather.weather[0].description}</small>
                        </>
                    ) : (
                        <p>Cargando clima...</p>
                    )}
                </div>

                {/* Iconos de Configuración y Ayuda */}
                <div className="bottom-icons d-flex">
                    <a href="/ayuda" className="icon-btn">
                        <i className="fas fa-question-circle"></i>
                    </a>
                    <a href="/configuracion" className="icon-btn">
                        <i className="fas fa-cog"></i>
                    </a>
                </div>
            </div>
        </>
    )
}

export default SideBarDashboard;    