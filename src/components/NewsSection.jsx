import React from 'react';
import '../styles/NewsSection.css';
import tendenciesTheRangerHub2025 from '../assets/the-ranger-hub-tendencias2025.png';
import newsGuides from '../assets/news-guides.jpg';
import newsPartnership from '../assets/news-partnership.jpg';

const NewsSection = () => {
    const news = [
        {
            id: 1,
            image: tendenciesTheRangerHub2025,
            title: "Las tendencias de turismo 2025: Exploración digital y experiencias inmersivas",
            description: "Descubre cómo la tecnología está transformando la manera en que viajamos y experimentamos nuevos destinos.",
            date: "Marzo 15, 2024"
        },
        {
            id: 2,
            image: newsGuides,
            title: "Cómo The Ranger Hub está conectando a más viajeros con guías locales que nunca antes",
            description: "Nuestra plataforma alcanza un nuevo hito en conexiones entre viajeros y expertos locales.",
            date: "Marzo 10, 2024"
        },
        {
            id: 3,
            image: newsPartnership,
            title: "Nueva alianza con Adventure Corp para ampliar la red de aventuras únicas",
            description: "Una colaboración estratégica que expandirá las opciones de experiencias para nuestros usuarios.",
            date: "Marzo 5, 2024"
        }
    ];

    return (
        <section className="news-section py-5">
            <div className="container" style={{marginTop: "0px"}}>
                <h2 className="text-center mb-5">Noticias Recientes</h2>

                <div className="row">
                    {news.map(item => (
                        <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={item.image}
                                    className="card-img-top"
                                    alt={item.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <small className="text-muted">{item.date}</small>
                                    <h5 className="card-title mt-2">{item.title}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <a href="#" className="btn btn-outline-primary mt-auto">
                                        Leer más
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-primary btn-lg">
                        Explora todas nuestras actualizaciones
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;