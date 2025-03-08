import React, { useState, useEffect } from "react";
import RangerCard from "../../components/RangerCard.jsx";
import "../../styles/Rangers.css";

export const Rangers = () => {
    const [rangers, setRangers] = useState([]);
    const [selectedRanger, setSelectedRanger] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // "all", "available", "unavailable"

    useEffect(() => {
        // Función para obtener los rangers de la API mejorada
        const fetchRangers = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Con la API extendida, ahora obtenemos toda la información necesaria en una sola llamada
                const response = await fetch('https://rangerhub-back.vercel.app/rangers');
                
                if (!response.ok) {
                    throw new Error(`Error al obtener rangers: ${response.status}`);
                }
                
                const data = await response.json();
                setRangers(data.rangers);
            } catch (err) {
                setError("Error al cargar los datos de rangers: " + err.message);
                console.error("Error al cargar rangers:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRangers();
    }, []);

    const handleRangerClick = async (ranger) => {
        try {
            // Obtener detalles completos del ranger si necesitamos datos adicionales
            const response = await fetch(`https://rangerhub-back.vercel.app/rangers/${ranger.id}`);
            
            if (response.ok) {
                const detailedRanger = await response.json();
                setSelectedRanger(detailedRanger);
            } else {
                // Si falla, usamos los datos que ya tenemos
                setSelectedRanger(ranger);
            }
            setShowModal(true);
        } catch (err) {
            console.error("Error al obtener detalles del ranger:", err);
            // En caso de error, usamos los datos que ya tenemos
            setSelectedRanger(ranger);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    // Filtrar rangers según el estado seleccionado
    const filteredRangers = rangers.filter(ranger => {
        if (filterStatus === "all") return true;
        if (filterStatus === "available") return ranger.isAvailable;
        if (filterStatus === "unavailable") return !ranger.isAvailable;
        return true;
    });

    return (
        <div className="rangers-container">
            <div className="rangers-header">
                <h2 className="rangers-title">Conoce a Nuestros Rangers</h2>
                <p className="rangers-subtitle">
                    Conoce a nuestro equipo de guías expertos que te acompañarán en tus aventuras
                </p>

                {/* Filtros */}
                <div className="rangers-filters">
                    <button
                        className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                        onClick={() => handleFilterChange("all")}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === "available" ? "active" : ""}`}
                        onClick={() => handleFilterChange("available")}
                    >
                        Disponibles
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === "unavailable" ? "active" : ""}`}
                        onClick={() => handleFilterChange("unavailable")}
                    >
                        No disponibles
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="rangers-grid container">
                    <div className="row">
                        {filteredRangers.length > 0 ? (
                            filteredRangers.map(ranger => (
                                <div key={ranger.id} className="col-md-6 col-lg-4 mb-4">
                                    <RangerCard ranger={ranger} onClick={handleRangerClick} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p className="text-center py-5">No se encontraron rangers con los filtros actuales</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de detalles del Ranger */}
            {showModal && selectedRanger && (
                <div className="modal-overlay">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                        <div className="modal-content ranger-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles del Ranger</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="ranger-detail-photo">
                                            <img 
                                                src={selectedRanger.photo} 
                                                alt={selectedRanger.name} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/300x400?text=Ranger";
                                                }}
                                            />
                                            <div className={`status-indicator ${selectedRanger.isAvailable ? 'available' : 'unavailable'}`}>
                                                {selectedRanger.isAvailable ? 'Disponible' : 'No Disponible'}
                                            </div>
                                        </div>
                                        <div className="ranger-detail-contact">
                                            <h6>Información de Contacto</h6>
                                            <p>
                                                <i className="bi bi-envelope"></i> {selectedRanger.email}
                                            </p>
                                            <p>
                                                <i className="bi bi-telephone"></i> {selectedRanger.phone}
                                            </p>
                                            <p>
                                                <i className="bi bi-geo-alt"></i> {selectedRanger.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="ranger-detail-header">
                                            <h3>{selectedRanger.name}</h3>
                                            <p className="ranger-detail-title">{selectedRanger.title}</p>
                                            <div className="ranger-detail-rating">
                                                <i className="bi bi-star-fill"></i> {selectedRanger.rating}/5
                                                <span className="trips-count">({selectedRanger.trips} viajes)</span>
                                            </div>
                                        </div>
                                        <div className="ranger-detail-bio">
                                            <h6>Biografía</h6>
                                            <p>{selectedRanger.bio}</p>
                                        </div>
                                        <div className="ranger-detail-specs">
                                            {selectedRanger.specialties && selectedRanger.specialties.length > 0 && (
                                                <div className="spec-section">
                                                    <h6>Especialidades</h6>
                                                    <div className="spec-tags">
                                                        {selectedRanger.specialties.map((spec, index) => (
                                                            <span key={index} className="spec-tag">{spec}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {selectedRanger.languages && selectedRanger.languages.length > 0 && (
                                                <div className="spec-section">
                                                    <h6>Idiomas</h6>
                                                    <div className="spec-tags">
                                                        {selectedRanger.languages.map((lang, index) => (
                                                            <span key={index} className="spec-tag">{lang}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {selectedRanger.certifications && selectedRanger.certifications.length > 0 && (
                                                <div className="spec-section">
                                                    <h6>Certificaciones</h6>
                                                    <div className="spec-tags">
                                                        {selectedRanger.certifications.map((cert, index) => (
                                                            <span key={index} className="spec-tag">{cert}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    Contactar Ranger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rangers;