import { useState} from "react";

const Testimonios = () => {
    const testimonios = [
        {
            nombre: "Emily Johnson",
            ubicacion: "Guía Local, EE.UU.",
            opinion:
                "Ranger Hub transformó mi pasión por guiar en un negocio próspero. Me encanta compartir mi conocimiento local con viajeros que aprecian experiencias únicas!",
            imagen: "https://via.placeholder.com/150",
        },
        {
            nombre: "Carlos Méndez",
            ubicacion: "Explorador, España",
            opinion:
                "Reservar tours nunca ha sido tan fácil. Los guías son increíbles y siempre descubro lugares ocultos en cada ciudad!",
            imagen: "https://via.placeholder.com/150",
        },
        {
            nombre: "Sophie Lee",
            ubicacion: "Guía, Australia",
            opinion:
                "Gracias a Ranger Hub, tengo un flujo constante de clientes que aprecian mi experiencia. ¡Muy recomendado!",
            imagen: "https://via.placeholder.com/150",
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
        <div className="container my-5 text-center">
            <h2>Lo que dicen nuestros clientes</h2>
            <div className="card mt-4 p-4">
                <div className="card-body">
                    <img src={testimonios[indice].imagen} alt={testimonios[indice].nombre} className="rounded-circle mb-3" width="100" height="100" />
                    <p className="card-text">"{testimonios[indice].opinion}"</p>
                    <div className="card-footer">
                        <strong>{testimonios[indice].nombre}</strong> - {testimonios[indice].ubicacion}
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <button className="btn btn-outline-dark me-2" onClick={anteriorTestimonio}>
                    ←
                </button>
                <button className="btn btn-outline-dark" onClick={siguienteTestimonio}>
                    →
                </button>
            </div>
        </div>
    );
};

export default Testimonios;