// pages/dashboard/Rangers.jsx
import React, { useState, useEffect } from "react";
import RangerCard from "../../components/RangerCard";
import "../../styles/Rangers.css";

// Datos de ejemplo (reemplazar con llamada a API real cuando esté disponible)
const rangerData = [
    {
        id: 1,
        name: "Carlos Rodriguez",
        title: "Experto en Senderismo",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        email: "carlos@rangerhub.com",
        phone: "+56 9 1234 5678",
        location: "Santiago, Chile",
        rating: 4.8,
        trips: 145,
        isAvailable: true,
        bio: "Guía con más de 10 años de experiencia en rutas de montaña y senderismo. Especialista en flora y fauna nativa de la Cordillera de los Andes.",
        specialties: ["Montañismo", "Senderismo", "Observación de aves"],
        languages: ["Español", "Inglés", "Portugués"],
        certifications: ["Primeros Auxilios en Áreas Silvestres", "Guía UIAGM"]
    },
    {
        id: 2,
        name: "Ana Martínez",
        title: "Guía de Montaña",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        email: "ana@rangerhub.com",
        phone: "+56 9 8765 4321",
        location: "Valparaíso, Chile",
        rating: 4.9,
        trips: 98,
        isAvailable: true,
        bio: "Apasionada por la montaña y la naturaleza. Experta en rutas de trekking y escalada en Chile central.",
        specialties: ["Escalada", "Trekking", "Campismo"],
        languages: ["Español", "Inglés", "Francés"],
        certifications: ["WFR", "Técnico en Turismo Aventura"]
    },
    {
        id: 3,
        name: "Javier Morales",
        title: "Especialista en Travesías",
        photo: "https://randomuser.me/api/portraits/men/62.jpg",
        email: "javier@rangerhub.com",
        phone: "+56 9 5555 6666",
        location: "Concepción, Chile",
        rating: 4.7,
        trips: 72,
        isAvailable: false,
        bio: "Guía con amplia experiencia en travesías de larga duración en la Patagonia. Experto en supervivencia y orientación.",
        specialties: ["Trekking", "Supervivencia", "Fotografía de naturaleza"],
        languages: ["Español", "Inglés"],
        certifications: ["WFR", "Orientación y Cartografía"]
    },
    {
        id: 4,
        name: "Lucía Valdés",
        title: "Guía de Kayak y Rafting",
        photo: "https://randomuser.me/api/portraits/women/28.jpg",
        email: "lucia@rangerhub.com",
        phone: "+56 9 7777 8888",
        location: "Puerto Varas, Chile",
        rating: 4.6,
        trips: 115,
        isAvailable: true,
        bio: "Especialista en deportes acuáticos con más de 8 años de experiencia. Instructora certificada de kayak y rafting.",
        specialties: ["Kayak", "Rafting", "Pesca deportiva"],
        languages: ["Español", "Inglés", "Alemán"],
        certifications: ["Instructor de Kayak IRF", "Primeros Auxilios"]
    },
    {
        id: 5,
        name: "Miguel Fuentes",
        title: "Experto en Aventura",
        photo: "https://randomuser.me/api/portraits/men/77.jpg",
        email: "miguel@rangerhub.com",
        phone: "+56 9 3333 4444",
        location: "La Serena, Chile",
        rating: 4.5,
        trips: 88,
        isAvailable: true,
        bio: "Guía multiaventura con experiencia en diversos terrenos. Especialista en circuitos de aventura para todos los niveles.",
        specialties: ["Ciclismo de montaña", "Rappel", "Canopy"],
        languages: ["Español", "Inglés"],
        certifications: ["Técnico Deportivo", "Rescate Vertical"]
    },
    {
        id: 6,
        name: "Camila Lagos",
        title: "Guía de Ecoturismo",
        photo: "https://randomuser.me/api/portraits/women/63.jpg",
        email: "camila@rangerhub.com",
        phone: "+56 9 2222 1111",
        location: "Pucón, Chile",
        rating: 4.9,
        trips: 102,
        isAvailable: false,
        bio: "Bióloga y guía especializada en ecoturismo. Experta en flora y fauna nativa con enfoque en conservación.",
        specialties: ["Observación de fauna", "Senderismo interpretativo", "Educación ambiental"],
        languages: ["Español", "Inglés", "Italiano"],
        certifications: ["Bióloga", "Guía de Turismo Sustentable"]
    }
];

export const Rangers = () => {
    const [rangers, setRangers] = useState([]);
    const [selectedRanger, setSelectedRanger] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // "all", "available", "unavailable"

    useEffect(() => {
        // Simulación de carga de datos (reemplazar con fetch a API real)
        setIsLoading(true);
        setTimeout(() => {
            setRangers(rangerData);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleRangerClick = (ranger) => {
        setSelectedRanger(ranger);
        setShowModal(true);
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
                <h2 className="rangers-title">Nuestros Rangers</h2>
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
                                            <img src={selectedRanger.photo} alt={selectedRanger.name} />
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
                                            <div className="spec-section">
                                                <h6>Especialidades</h6>
                                                <div className="spec-tags">
                                                    {selectedRanger.specialties.map((spec, index) => (
                                                        <span key={index} className="spec-tag">{spec}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="spec-section">
                                                <h6>Idiomas</h6>
                                                <div className="spec-tags">
                                                    {selectedRanger.languages.map((lang, index) => (
                                                        <span key={index} className="spec-tag">{lang}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="spec-section">
                                                <h6>Certificaciones</h6>
                                                <div className="spec-tags">
                                                    {selectedRanger.certifications.map((cert, index) => (
                                                        <span key={index} className="spec-tag">{cert}</span>
                                                    ))}
                                                </div>
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