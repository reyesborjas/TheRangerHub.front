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
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://patagoniatours.cl/wp-content/uploads/2014/02/tour-trekking-base-torres-del-paine2.jpg"
                                    alt="Torres del Paine"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Torres del Paine, Chile</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://anacvarelar.wordpress.com/wp-content/uploads/2013/11/rafting-04y051-07-09_043.jpg"
                                    alt="Rafting Venezuela"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Río Barinas, Venezuela</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://ojo.pe/resizer/v2/HFSWMWMELZGVVB6NSC55554YNA.jpeg?auth=8846b5d6a19d04083aa26aaff3b80b031f07701abc94790efc03caba86dd344b&width=580&height=330&quality=75&smart=true"
                                    alt="Machu Picchu"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Machu Picchu, Perú</div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://puconchile.travel/wp-content/uploads/2023/12/Fotos-Canopy-Vuelo-del-condor3-1024x600.jpg"
                                    alt="Canopy Pucón"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">Pucón, Chile</div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src="https://sandboard.cl/wp-content/uploads/2025/01/GOPR1095-scaled.jpg"
                                    alt="Sandboard San Pedro"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
                                />
                                <div className="image-text">San Pedro de Atacama, Chile</div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>

            {/* Mapa y próximos viajes */}
            <div className="row mt-4" style={{ fontSize: "12px"}} >
                {/* Mapa del viaje usando OpenLayers */}
                <div className="col-md-6" style={ {width: "100%"}}>
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
                </div><br></br>

                {/* Tabla de próximos viajes */}
                <div className="col-md-6"style={ {width: "100%", marginTop: "5px"}}>
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