import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import SideBarDashboard from "../../components/SideBarDashboard.jsx";
import TopNavbar from "../../components/TopNavbar.jsx";
import TripsModal from "../../components/TripsModal.jsx";

const MisViajes = () => {
    const [viajes, setViajes] = useState([]);
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // 1️⃣ **Obtener usuario autenticado desde el backend**
                const userResponse = await fetch("https://rangerhub-back.vercel.app/auth/user", {
                    credentials: "include" // Si usas sesiones o cookies en el backend
                });

                if (!userResponse.ok) {
                    console.error("Error obteniendo usuario autenticado");
                    return;
                }

                const userData = await userResponse.json();
                setUsuarioAutenticado(userData);

                // 2️⃣ **Obtener lista de viajes**
                const tripsResponse = await fetch("https://rangerhub-back.vercel.app/trips");
                const tripsData = await tripsResponse.json();

                // 3️⃣ **Filtrar los viajes por el usuario autenticado**
                const viajesFiltrados = tripsData.filter(viaje => viaje.lead_ranger === userData.id);

                setViajes(viajesFiltrados);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchDatos();
    }, []);

    return (
        <div className="dashboard-layout">
            <SideBarDashboard/>
            <TopNavbar/>

            <div className="dashboard-content">
                <Container className="mt-4">
                    <h2 className="mb-4">Mis Viajes</h2>
                    <Row>
                        {viajes.length === 0 ? (
                            <p>No tienes viajes creados.</p>
                        ) : (
                            viajes.map((viaje) => (
                                <Col md={4} key={viaje.id} className="mb-4">
                                    <Card
                                        onClick={() => setViajeSeleccionado(viaje)}
                                        className="hover-shadow"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Card.Img variant="top" src={viaje.trip_image_url} alt={viaje.trip_name} />
                                        <Card.Body>
                                            <Card.Title>{viaje.trip_name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>

                    {viajeSeleccionado && (
                        <TripsModal
                            viaje={viajeSeleccionado}
                            onHide={() => setViajeSeleccionado(null)}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
};

export default MisViajes;