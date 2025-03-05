// components/RangerCard.jsx
import React from "react";
import "../styles/RangerCard.css";

const RangerCard = ({ ranger, onClick }) => {
    return (
        <div className="ranger-card">
            <div className="ranger-photo-container" onClick={() => onClick(ranger)}>
                <img
                    src={ranger.photo}
                    alt={`${ranger.name}`}
                    className="ranger-photo"
                />
                <div className="view-details-overlay">
                    <span>Ver detalles</span>
                </div>
            </div>
            <div className="ranger-info">
                <h3 className="ranger-name">{ranger.name}</h3>
                <p className="ranger-title">{ranger.title}</p>
                <div className="ranger-stats">
                    <div className="stat">
                        <i className="bi bi-star-fill"></i>
                        <span>{ranger.rating}/5</span>
                    </div>
                    <div className="stat">
                        <i className="bi bi-compass"></i>
                        <span>{ranger.trips} viajes</span>
                    </div>
                </div>
                <div className="ranger-badge">
                    {ranger.isAvailable ? (
                        <span className="badge available">Disponible</span>
                    ) : (
                        <span className="badge unavailable">No Disponible</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RangerCard;