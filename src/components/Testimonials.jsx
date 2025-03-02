import React, { useState } from "react";
import "../styles/Testimonials.css";

const Testimonios = () => {
    const testimonios = [
        {
            nombre: "Emily Johnson",
            ubicacion: "Guía Local, EE.UU.",
            opinion:
                "Ranger Hub transformó mi pasión por guiar en un negocio próspero. Me encanta compartir mi conocimiento local con viajeros que aprecian experiencias únicas!",
            imagen: "https://agenciamoneta.com.br/wp-content/uploads/2024/06/Marina-Dutra_foto-de-perfil-redonda.png",
        },
        {
            nombre: "Carlos Méndez",
            ubicacion: "Explorador, España",
            opinion:
                "Reservar tours nunca ha sido tan fácil. Los guías son increíbles y siempre descubro lugares ocultos en cada ciudad!",
            imagen: "https://identidadydesarrollo.com/wp-content/uploads/2017/10/Idyd_Roberto-Dupuis-600.png",
        },
        {
            nombre: "Jordan Lee",
            ubicacion: "Guía, Australia",
            opinion:
                "Gracias a Ranger Hub, tengo un flujo constante de clientes que aprecian mi experiencia. ¡Muy recomendado!",
            imagen: "https://ancaresactiva.com/wp-content/uploads/2021/08/perfil-dani-circular.png",
        },
    ];

    const [indice, setIndice] = useState(0);

    const anteriorTestimonio = () => {
        setIndice(indice === 0 ? testimonios.length - 1 : indice - 1);
    };

    const siguienteTestimonio = () => {
        setIndice(indice === testimonios.length - 1 ? 0 : indice + 1);
    };

    return (
        <div className="container testimonial-container">
            <h2 className="text-center" id="testimonial-h2">Lo que dicen nuestros clientes</h2>
            <div className="testimonial-card row mx-auto">
                <div
                    className="col-md-6 testimonial-image"
                    style={{ backgroundImage: `url(${testimonios[indice].imagen})` }}
                ></div>
                <div className="col-md-6 testimonial-content d-flex flex-column justify-content-center p-4">
                    <p className="testimonial-opinion">"{testimonios[indice].opinion}"</p>
                    <div className="testimonial-author">
                        <strong>{testimonios[indice].nombre}</strong> - {testimonios[indice].ubicacion}
                    </div>
                    <br/>
                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <button className="btn btn-ranger" onClick={anteriorTestimonio}>
                            ←
                        </button>
                        <button className="btn btn-ranger" onClick={siguienteTestimonio}>
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonios;