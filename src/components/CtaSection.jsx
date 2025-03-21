import React from "react";
import "../styles/CtaSections.css";
import {useNavigate } from "react-router-dom";


const CtaSection = () => {
    const navigate = useNavigate();
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>Únete y Explora Hoy</h2>
                <p>
                    Conviértete en un Ranger o descubre aventuras únicas hechas a tu medida.
                    ¡La elección es tuya!
                </p>
                <div className="cta-buttons">
                <button
                        className="btn btn-ranger"
                        onMouseEnter={() => setBackgroundImage("/public/ranger.jpg")}
                        onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
                        onClick={() => navigate("/signup")}
                    >
                        Únete
                    </button>
                    <button
                        className="btn btn-explorer"
                        onMouseEnter={() => setBackgroundImage("/public/explorer.jpg")}
                        onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
                        onClick={() => navigate("/signup")}
                    >
                        Explora
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;