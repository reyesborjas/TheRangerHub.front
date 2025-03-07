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
    
    // Obtener datos del usuario desde localStorage
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState('');
    
    // Cargar datos de usuario al inicio
    useEffect(() => {
        try {
            // Intentar obtener datos desde currentUser (objeto JSON)
            const currentUserStr = localStorage.getItem('currentUser');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                setUserId(currentUser.id);
                setUserRole(currentUser.role_name?.toLowerCase() || '');
                setUsername(currentUser.username || '');
                console.log("ID de usuario obtenido:", currentUser.id);
                console.log("Rol de usuario obtenido:", currentUser.role_name);
            } else {
                console.error("No se encontró 'currentUser' en localStorage");
                setError("No se pudo identificar al usuario");
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
                const endpoint = userRole === 'ranger' 
                    ? `/trips/ranger/${userId}` 
                    : `/trips/explorer/${userId}`;
                
                console.log("Consultando endpoint:", endpoint);
                const response = await axios.get(endpoint);
                
                // Procesar y ordenar los viajes por fecha
                if (response.data && response.data.trips) {
                    const sortedTrips = response.data.trips
                        .map(trip => ({
                            ...trip,
                            start_date: trip.start_date ? new Date(trip.start_date) : new Date()
                        }))
                        .sort((a, b) => a.start_date - b.start_date)
                        .slice(0, 3); // Mostrar solo los 3 primeros
                    
                    setTrips(sortedTrips);
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
    }, [userId, userRole]);

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
                            <h6>Mapa del viaje</h6>
                            <OpenLayersMap lat={-51.1229} lon={-73.0486} zoom={8} />
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
                                                <tr key={trip.id || index}>
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
                                onClick={() => navigate(`/secured/${username}/dashboard/mytrips`)} 
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