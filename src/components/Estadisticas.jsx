import React, { useEffect, useState } from "react";
import "../styles/Estadisticas.css";

const Estadisticas = () => {
    const [countTours, setCountTours] = useState(0);
    const [countRebook, setCountRebook] = useState(0);

    useEffect(() => {
        const intervalTours = setInterval(() => {
            setCountTours((prev) => (prev < 5000 ? prev + 50 : 5000));
        }, 10);

        const intervalRebook = setInterval(() => {
            setCountRebook((prev) => (prev < 87 ? prev + 1 : 87));
        }, 50);

        return () => {
            clearInterval(intervalTours);
            clearInterval(intervalRebook);
        };
    }, []);

    return (
        <div className="statistics-container">
            <h2 className="statistics-title">Descubre el impacto de nuestra plataforma</h2>
            <div className="statistics-content">
                <div className="stat-item">
                    <div className="stat-number">{countTours}+</div>
                    <div className="stat-subtitle1">Tours vendidos en todo el mundo</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">{countRebook}%</div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${countRebook}%` }}></div>
                    </div>
                    <div className="stat-subtitle2">De los viajeros reservan nuevamente</div>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;