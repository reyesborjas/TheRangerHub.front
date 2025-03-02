import React, { useEffect, useState, useRef } from "react";
import "../styles/Estadisticas.css";

const Estadisticas = () => {
    const [countTours, setCountTours] = useState(0);
    const [countRebook, setCountRebook] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.2,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [hasAnimated]);

    useEffect(() => {
        if (hasAnimated) {
            // Suma 25 cada 25ms => tardará ~5s en llegar a 5000
            const intervalTours = setInterval(() => {
                setCountTours((prev) => (prev < 5000 ? prev + 25 : 5000));
            }, 25);

            // Suma 1 cada 50ms => tardará ~4.35s en llegar a 87
            const intervalRebook = setInterval(() => {
                setCountRebook((prev) => (prev < 87 ? prev + 1 : 87));
            }, 50);

            return () => {
                clearInterval(intervalTours);
                clearInterval(intervalRebook);
            };
        }
    }, [hasAnimated]);

    return (
        <div className="statistics-container" ref={containerRef}>
            <h2 className="statistics-title">
                Descubre el impacto de nuestra plataforma
            </h2>
            <div className="statistics-content">
                <div className="stat-item">
                    <div className="stat-number">{countTours}+</div>
                    <div className="stat-subtitle1">
                        Tours vendidos en todo el mundo
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">{countRebook}%</div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${countRebook}%` }}></div>
                    </div>
                    <div className="stat-subtitle2">
                        De los viajeros reservan nuevamente
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;