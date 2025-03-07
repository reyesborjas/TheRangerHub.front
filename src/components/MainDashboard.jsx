import React, { useState, useEffect } from "react";
import "../styles/MainDashboard.css";
import { Carousel } from "react-bootstrap";
import OpenLayersMap from "../components/OpenLayersMap.jsx";
import 'ol/ol.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainDashboard = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextTripId, setNextTripId] = useState(null);
    const [nextTrip, setNextTrip] = useState(null);
    
    // Obtener datos del usuario desde el token JWT
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState('');
    
    // URL base para las peticiones
    const baseUrl = "https://rangerhub-back.vercel.app";
    
    // Cargar datos de usuario al inicio desde el token JWT
    useEffect(() => {
        try {
            // Intentar obtener y decodificar el token JWT
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = JSON.parse(atob(token.split(".")[1]));
                    setUserId(decoded.user_id);
                    setUserRole(decoded.role_name);
                    setUsername(decoded.username || '');
                    console.log("Token decodificado:", decoded);
                    console.log("ID de usuario obtenido:", decoded.user_id);
                    console.log("Rol de usuario obtenido:", decoded.role_name);
                } catch (err) {
                    console.error("Error al decodificar el token:", err);
                    setError("Error al verificar la autenticación");
                }
            } else {
                // Intentar obtener desde currentUser como respaldo
                const currentUserStr = localStorage.getItem('currentUser');
                if (currentUserStr) {
                    try {
                        const currentUser = JSON.parse(currentUserStr);
                        setUserId(currentUser.id);
                        setUserRole(currentUser.role_name);
                        setUsername(currentUser.username || '');
                        console.log("Datos obtenidos de currentUser:", currentUser);
                    } catch (parseErr) {
                        console.error("Error al parsear currentUser:", parseErr);
                    }
                } else {
                    console.error("No se encontró token ni currentUser");
                    setError("No se pudo identificar al usuario");
                }
            }
        } catch (err) {
            console.error("Error al procesar datos del usuario:", err);
            setError("Error al identificar usuario");
        }
    }, []);
    
    // Función para formatear la fecha
    const formatDate = (dateString) => {
        try {
            const date = dateString instanceof Date ? dateString : new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Fecha pendiente";
            }
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (err) {
            return "Fecha pendiente";
        }
    };

    // Cargar viajes cuando tengamos el ID y rol
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                if (!userId) {
                    return; // Salir si no hay userId
                }
                
                setLoading(true);
                
                // Seleccionar el endpoint correcto según el rol del usuario
                const endpoint = userRole === 'Ranger' || userRole === 'ranger'
                    ? `/trips/ranger/${userId}` 
                    : `/trips/explorer/${userId}`;
                
                const url = `${baseUrl}${endpoint}`;
                console.log("Consultando endpoint:", url);
                
                const response = await axios.get(url);
                console.log("Respuesta del servidor:", response.data);
                
                // Procesar y ordenar los viajes por fecha
                if (response.data && response.data.trips) {
                    // Convertir fechas y ordenar por start_date
                    const processedTrips = response.data.trips.map(trip => ({
                        ...trip,
                        start_date: trip.start_date ? new Date(trip.start_date) : new Date()
                    }));
                    
                    // Ordenar por fecha (los más próximos primero)
                    const sortedTrips = [...processedTrips].sort((a, b) => a.start_date - b.start_date);
                    
                    // Tomar solo los 3 primeros para mostrar
                    const tripsToDisplay = sortedTrips.slice(0, 3);
                    
                    console.log("Viajes procesados:", tripsToDisplay);
                    setTrips(tripsToDisplay);
                    
                    // Usar el primer viaje de la lista como próximo viaje para el mapa
                    if (sortedTrips.length > 0) {
                        setNextTripId(sortedTrips[0].id);
                        setNextTrip(sortedTrips[0]);
                        console.log("ID del próximo viaje:", sortedTrips[0].id);
                    }
                } else {
                    console.log("No se encontraron viajes en la respuesta", response.data);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar los viajes:", err);
                setError("Error al cargar los viajes");
                setLoading(false);
            }
        };
        
        if (userId && userRole) {
            fetchTrips();
        }
    }, [userId, userRole, baseUrl]);

    return (
        <div className="container main-dashboard">
            {/* Slider de imágenes */}
            <div className="row">
                <div className="col-12">
                    <Carousel className="hero-slider">
                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://patagoniatours.cl/wp-content/uploads/2014/02/tour-trekking-base-torres-del-paine2.jpg"
                                    alt="Torres del Paine"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Torres del Paine, Chile</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://anacvarelar.wordpress.com/wp-content/uploads/2013/11/rafting-04y051-07-09_043.jpg"
                                    alt="Rafting Venezuela"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Río Barinas, Venezuela</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://ojo.pe/resizer/v2/HFSWMWMELZGVVB6NSC55554YNA.jpeg?auth=8846b5d6a19d04083aa26aaff3b80b031f07701abc94790efc03caba86dd344b&width=580&height=330&quality=75&smart=true"
                                    alt="Machu Picchu"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Machu Picchu, Perú</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://puconchile.travel/wp-content/uploads/2023/12/Fotos-Canopy-Vuelo-del-condor3-1024x600.jpg"
                                    alt="Canopy Pucón"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Pucón, Chile</div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://sandboard.cl/wp-content/uploads/2025/01/GOPR1095-scaled.jpg"
                                    alt="Sandboard San Pedro"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">San Pedro de Atacama, Chile</div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>

            {/* Mapa y próximos viajes */}
            <div className="row mt-4 d-flex align-items-stretch" style={{ fontSize: "12px" }}>
                {/* Mapa del viaje usando OpenLayers */}
                <div className="col-md-6 d-flex">
                    <div className="card map-container text-center w-100 h-100">
                        <div className="card-body">
                            <h6>
                                {nextTrip ? (
                                    <>Mapa del viaje: <span className="text-primary">{nextTrip.trip_name}</span></>
                                ) : (
                                    "Mapa del viaje"
                                )}
                            </h6>
                            {nextTripId ? (
                                <OpenLayersMap 
                                    tripId={nextTripId} 
                                    defaultLat={-33.4489} 
                                    defaultLon={-70.6693} 
                                    defaultZoom={6} 
                                />
                            ) : (
                                <OpenLayersMap 
                                    defaultLat={-33.4489} 
                                    defaultLon={-70.6693} 
                                    defaultZoom={6} 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla de próximos viajes */}
                <div className="col-md-6 d-flex">
                    <div className="card upcoming-trips text-center w-100 h-100">
                        <div className="card-body">
                            <h6>Próximos viajes</h6>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Estado</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trips && trips.length > 0 ? (
                                            trips.map((trip, index) => (
                                                <tr 
                                                    key={trip.id || index}
                                                    className={trip.id === nextTripId ? "table-primary" : ""}
                                                    title={trip.id === nextTripId ? "Este viaje se muestra en el mapa" : ""}
                                                >
                                                    <td>{trip.trip_name || 'Sin nombre'}</td>
                                                    <td>{trip.trip_status || 'Desconocido'}</td>
                                                    <td>{formatDate(trip.start_date)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No hay viajes programados</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                            <button 
                                onClick={() => {
                                    // Usar nombre de usuario del localStorage o del estado
                                    const userFromStorage = localStorage.getItem('currentUser') ? 
                                        JSON.parse(localStorage.getItem('currentUser')).username : '';
                                    const tokenData = localStorage.getItem('token') ? 
                                        JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : '';
                                    const usernameToUse = username || 
                                                         (tokenData && tokenData.username) || 
                                                         userFromStorage || 
                                                         'explorer_reyes';
                                    
                                    console.log("Navegando a:", `/secured/${usernameToUse}/dashboard/mytrips`);
                                    navigate(`/secured/${usernameToUse}/dashboard/mytrips`);
                                }} 
                                className="btn btn-danger btn-lg w-100 mt-3"
                            >
                                Consultar más viajes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;