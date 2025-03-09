import React, { useState, useEffect } from "react";
import RangerCard from "../../components/RangerCard.jsx";
import "../../styles/Rangers.css";

export const Rangers = () => {
    const [rangers, setRangers] = useState([]);
    const [selectedRanger, setSelectedRanger] = useState(null);
    const [rangerCertifications, setRangerCertifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingCertifications, setIsLoadingCertifications] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // "all", "available", "unavailable"

    useEffect(() => {
        // Función para obtener los rangers de la API
        const fetchRangers = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Obtener datos de la API existente
                const response = await fetch('https://rangerhub-back.vercel.app/rangers');
                
                if (!response.ok) {
                    throw new Error(`Error al obtener rangers: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.rangers && Array.isArray(data.rangers)) {
                    setRangers(data.rangers);
                } else {
                    setRangers([]);
                    setError("La respuesta del servidor no contiene datos de rangers válidos");
                }
            } catch (err) {
                console.error("Error al cargar rangers desde la API:", err);
                setError("Error al cargar los datos de rangers: " + err.message);
                setRangers([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRangers();
    }, []);

    // Función para obtener las certificaciones de un ranger
    const fetchRangerCertifications = async (rangerId) => {
        setIsLoadingCertifications(true);
        setRangerCertifications([]);
        
        try {
            // Usar la nueva ruta para certificaciones
            const response = await fetch(`https://rangerhub-back.vercel.app/api/guide-certifications/${rangerId}`);
            
            if (!response.ok) {
                throw new Error(`Error al obtener certificaciones: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.certifications && Array.isArray(data.certifications)) {
                setRangerCertifications(data.certifications);
            }
        } catch (err) {
            console.error("Error al cargar certificaciones:", err);
            // No mostramos error, simplemente dejamos la lista vacía
        } finally {
            setIsLoadingCertifications(false);
        }
    };

    const handleRangerClick = async (ranger) => {
        // Guardar los datos básicos del ranger
        setSelectedRanger(ranger);
        setShowModal(true);
        
        // Obtener certificaciones
        fetchRangerCertifications(ranger.id);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRangerCertifications([]);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    // Función para truncar el email
    const getTruncatedEmail = (email) => {
        if (!email) return "No disponible";
        
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        
        const username = parts[0];
        const domain = parts[1];
        
        // Dividir el dominio en nombre y extensión
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return email;
        
        const domainName = domainParts.slice(0, -1).join('.');
        const extension = domainParts[domainParts.length - 1];
        
        // Formato truncado
        const truncatedUsername = username.charAt(0) + "...";
        const truncatedDomain = domainName.charAt(0) + "..." + "." + extension;
        
        return truncatedUsername + "@" + truncatedDomain;
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

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

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
                    <div className="modal-dialog modal-dialog-centered modal-lg">
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
                                                src={selectedRanger.photo || "https://randomuser.me/api/portraits/men/1.jpg"} 
                                                alt={selectedRanger.name} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                                                }}
                                            />
                                            <div className={`status-indicator ${selectedRanger.isAvailable ? 'available' : 'unavailable'}`}>
                                                {selectedRanger.isAvailable ? 'Disponible' : 'No Disponible'}
                                            </div>
                                        </div>
                                        <div className="ranger-detail-contact">
                                            <h6>Información de Contacto</h6>
                                            <p className="contact-item">
                                                <i className="bi bi-envelope"></i>
                                                <span className="email-text" title={selectedRanger.email}>
                                                    {getTruncatedEmail(selectedRanger.email)}
                                                </span>
                                            </p>
                                            <p className="contact-item">
                                                <i className="bi bi-telephone"></i> {selectedRanger.phone || "No disponible"}
                                            </p>
                                            <p className="contact-item">
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
                                            <p>{selectedRanger.bio || "Información no disponible"}</p>
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
                                            
                                            {/* Sección de certificaciones */}
                                            <div className="spec-section">
                                                <h6>Certificaciones</h6>
                                                {isLoadingCertifications ? (
                                                    <div className="text-center py-2">
                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                            <span className="visually-hidden">Cargando...</span>
                                                        </div>
                                                    </div>
                                                ) : rangerCertifications.length > 0 ? (
                                                    <div className="spec-tags">
                                                        {rangerCertifications.map((cert, index) => (
                                                            <span 
                                                                key={index} 
                                                                className="spec-tag" 
                                                                title={`${cert.title} - Emitido por: ${cert.issued_by || 'No especificado'}`}
                                                            >
                                                                {cert.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted small">No hay certificaciones disponibles</p>
                                                )}
                                            </div>
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