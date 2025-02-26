import React from "react";
import "../styles/GuideOrExplorer.css"; // Estilos personalizados
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const GuideOrExplorer = () => {
  return (
    <section className="container my-5">
      <h2 className="text-center">¿Eres Guía o un Viajero?</h2>
      <p className="text-center text-muted">Tú decides cómo vivir la aventura.</p>

      {/* 🏕️ Sección Rangers */}
      <div className="row align-items-center mt-5 ranger-section">
        <div className="col-md-6 text-left">
          <h3>Rangers</h3>
          <div className="image-circle ranger-img"></div> {/* Imagen circular */}
          <p className="fw-bold">Gana dinero compartiendo experiencias</p>
        </div>
        <div className="col-md-6">
          <ul className="features-list">
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color: "#FF6F61", marginRight: "5px" }} />
              Monetiza tu pasión por los viajes.
            </li>
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color:  "#FF6F61", marginRight: "5px" }} />
              Elige tus precios y horarios.
            </li>
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color:  "#FF6F61", marginRight: "5px" }} />
              Conéctate con viajeros listos para reservar.
            </li>
          </ul>
        </div>
      </div>

      {/* 🌎 Sección Explorer (invertida) */}
      <div className="row align-items-center mt-5 explorer-section">
        <div className="col-md-6 order-md-2 text-right">
          <h3>Explorer</h3>
          <div className="image-circle explorer-img"></div> {/* Imagen circular */}
          <p className="fw-bold">Descubre experiencias únicas</p>
        </div>
        <div className="col-md-6 order-md-1">
          <ul className="features-list">
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color: "lightgreen", marginRight: "5px" }} />
              Explora tours únicos creados por expertos.
            </li>
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color: "lightgreen", marginRight: "5px" }} />
              Reserva de forma segura y sin complicaciones.
            </li>
            <li>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color: "lightgreen", marginRight: "5px" }} />
              Descubre lugares como nunca antes.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default GuideOrExplorer;
