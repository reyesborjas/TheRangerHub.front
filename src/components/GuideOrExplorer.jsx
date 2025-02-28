import React from "react";
import "../styles/GuideOrExplorer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const GuideOrExplorer = () => {
  return (
      <section className="container my-5">
        <h2 className="text-center" id="title-h2">
          ¿Eres Guía o un Viajero?
        </h2>
        <p className="text-center text-muted" id="p-h2">
          Tú decides cómo vivir la aventura.
        </p>

        <div className="row align-items-center text-center mt-5 ranger-section">
          <div className="col-md-6">
            <h3 className="mb-3">Rangers</h3>
            <div className="image-circle ranger-img mb-3"></div>
            <p className="fw-bold">Gana dinero compartiendo experiencias</p>
          </div>
          <div className="col-md-6">
            <ul className="features-list">
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosRanger" />
                Monetiza tu pasión por los viajes.
              </li>
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosRanger" />
                Elige tus precios y horarios.
              </li>
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosRanger" />
                Conéctate con viajeros listos para reservar.
              </li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center text-center mt-5 explorer-section">
          <div className="col-md-6">
            <ul className="features-list">
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosExplorer" />
                Explora tours únicos creados por expertos.
              </li>
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosExplorer" />
                Reserva de forma segura y sin complicaciones.
              </li>
              <li>
                <FontAwesomeIcon icon={faCircleCheck} className="iconosExplorer" />
                Descubre lugares como nunca antes.
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Explorer</h3>
            <div className="image-circle explorer-img"></div>
            <p className="fw-bold">Descubre experiencias únicas</p>
          </div>
        </div>
      </section>
  );
};

export default GuideOrExplorer;