import React, {useState, useEffect} from 'react';
import logo from "../assets/logo.png";
import "../styles/SideBarDashboard.css";

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
        <>
            <div className="sidebar d-flex flex-column align-items-center">
                <div className="logo">
                    <img src={logo} alt="The Ranger Hub" />
                </div>

                <button className="new-trip-btn" onClick={() => window.location.href = "/dashboard/createtrip"}>+ Nuevo Viaje
                </button>


                <nav className="nav flex-column w-100">
                    <a href="/inicio" className="nav-link">
                        <i className="fas fa-home"></i> Inicio
                    </a>
                    <a href="/dashboard/mytrips" className="nav-link">
                        <i className="fas fa-suitcase"></i> Mis Viajes
                    </a>
                    <a href="/dashboard/trips" className="nav-link">
                        <i className="fas fa-map"></i> Viajes
                    </a>
                    <a href="/dashboard/activities" className="nav-link">
                        <i className="fas fa-bicycle"></i> Actividades
                    </a>
                    <a href="/dashboard/resources" className="nav-link">
                        <i className="fas fa-book"></i> Recursos
                    </a>
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
                    <a href="/ayuda" className="icon-btn">
                        <i className="fas fa-question-circle"></i>
                    </a>
                    <a href="/configuracion" className="icon-btn">
                        <i className="fas fa-cog"></i>
                    </a>
                </div>
            </div>
        </>
    );
};

export default SideBarDashboard;