import React from "react";
import "../styles/MainDashboard.css";
import { Carousel } from "react-bootstrap";
import OpenLayersMap from "../components/OpenLayersMap.jsx";
import 'ol/ol.css';

const MainDashboard = () => {
    return (
        <div className="container main-dashboard">
            {/* Slider de imágenes */}
            <div className="row">
                <div className="col-12">
                    <Carousel className="hero-slider">
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/Torres.jpeg"
                                alt="Torres del Paine"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/img.png"
                                alt="Torres del Paine"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                            />
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>

            {/* Tarjetas de información del viaje */}
            <div className="row mt-4">
                <div className="col-md-4">
                    <div className="card travel-info text-center">
                        <div className="card-body">
                            <h6>Fecha de viaje</h6>
                            <h4>6 días</h4>
                            <p>17.02.2025</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card people-info text-center">
                        <div className="card-body">
                            <h6>Personas</h6>
                            <h4>2 / Adultos</h4>
                            <div className="avatars">
                                <img
                                    src="https://randomuser.me/api/portraits/men/40.jpg"
                                    alt="José"
                                    className="avatar"
                                />
                                <img
                                    src="https://randomuser.me/api/portraits/women/40.jpg"
                                    alt="Angela"
                                    className="avatar"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card destination-info text-center">
                        <div className="card-body">
                            <h6>Destino</h6>
                            <h4>Torres del Paine</h4>
                            <p>Santiago → Puerto Varas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa y próximos viajes */}
            <div className="row mt-4">
                {/* Mapa del viaje usando OpenLayers */}
                <div className="col-md-6">
                    <div className="card map-container text-center">
                        <div className="card-body">
                            <h6>Mapa del viaje</h6>
                            {/* Reemplaza el iframe con tu componente de OpenLayers */}
                            <OpenLayersMap
                                lat={-51.1229}  // Ejemplo: Torres del Paine
                                lon={-73.0486}
                                zoom={8}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla de próximos viajes */}
                <div className="col-md-6">
                    <div className="card upcoming-trips text-center">
                        <div className="card-body">
                            <h6>Próximos viajes</h6>
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Buenos Aires</td>
                                    <td>Confirmado</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Machu Picchu</td>
                                    <td>Pendiente</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>San Pedro de Atacama</td>
                                    <td>En curso</td>
                                </tr>
                                </tbody>
                            </table>
                            <button className="btn btn-danger btn-lg w-100 mt-3">
                                Consultar más viajes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;