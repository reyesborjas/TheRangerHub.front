import React from "react";
import "../styles/CtaSections.css";

const CtaSection = () => {
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>Únete y Explora Hoy</h2>
                <p>
                    Conviértete en un Ranger o descubre aventuras únicas hechas a tu medida.
                    ¡La elección es tuya!
                </p>
                <div className="cta-buttons">
                    <button className="btn btn-primary">Unirse</button>
                    <button className="btn btn-secondary">Explorar</button>
                </div>
            </div>
            <div className="cta-image">
                <img src="#" alt="Exploración y aventura" />
            </div>
        </section>
    );
};

export default CtaSection;