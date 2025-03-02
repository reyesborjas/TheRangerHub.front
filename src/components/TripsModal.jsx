import React from "react";
import { Modal, Button } from "react-bootstrap";

const TripsModal = ({ viaje, onHide }) => {
    if (!viaje) return null;

    return (
        <Modal show={true} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{viaje.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img
                    src={viaje.imagen}
                    alt={viaje.titulo}
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                />
                <p><strong>Destino:</strong> {viaje.destino}</p>
                <p><strong>Duración:</strong> {viaje.duracion} días</p>
                <p><strong>Fecha de salida:</strong> {viaje.fecha}</p>
                <p><strong>Participantes:</strong> {viaje.participantes.join(", ")}</p>
                <p><strong>Actividades:</strong> {viaje.actividades}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TripsModal;