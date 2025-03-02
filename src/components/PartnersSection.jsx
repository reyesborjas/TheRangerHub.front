import React from "react";
import "../styles/PartnersSection.css";
import airbnbLogo from "../assets/airbnb-logo.jpg";
import expediaLogo from "../assets/expedia-logo.jpg";
import tripadvisorLogo from "../assets/tripadvisor-logo.png";
import bookingLogo from "../assets/booking-logo.png";
import sernaturLogo from "../assets/sernatur-logo.png";

import "../styles/PartnersSection.css";

// Definición del array de socios
const partners = [
    { img: airbnbLogo, name: "Airbnb" },
    { img: expediaLogo, name: "Expedia" },
    { img: tripadvisorLogo, name: "Tripadvisor" },
    { img: bookingLogo, name: "Booking.com" },
    { img: sernaturLogo, name: "SERNATUR" }
];

const PartnersSection = () => {
    return (
        <div className="partners-section text-center py-5">
            <h2 className="fw-bold text-danger">
                Más de 2,600 viajeros y empresas confían en The Ranger Hub
            </h2>
            <h5 className="text-muted mt-4 mb-5">
                Descubre el mundo con el respaldo de las mejores plataformas de turismo.
            </h5>
            <div className="d-flex justify-content-center flex-wrap mt-4">
                {partners.map((partner, index) => (
                    <div key={index} className="partner-icon mx-3">
                        <div className="partner-logo-container">
                            <img
                                src={partner.img}
                                alt={partner.name}
                                className="partner-logo hover-effect"
                            />
                        </div>
                        <p className="mt-2">{partner.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartnersSection;
