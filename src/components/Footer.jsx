import React from "react";
import "../styles/Footer.css";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faXTwitter, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <img src={logo} alt="Logo" className="footer-logo" />
                    <p><strong>Dirección:</strong> Av Manquehue Norte 230, Las Condes</p>
                    <p><strong>Contacto:</strong> <a href="tel:977600874">+56977600874</a></p>
                    <p><a href="mailto:info@therangerhub.com">info@therangerhub.com</a></p>
                    <div className="footer-socials">
                        <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
                        <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                        <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                    </div>
                </div>
                <div className="footer-links">
                    <ul>
                        <li><a href="#">Explorar Tours</a></li>
                        <li><a href="#">Convertirse en Ranger</a></li>
                        <li><a href="#">Centro de Ayuda</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Nuestro Equipo</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Contáctanos</a></li>
                        <li><a href="#">Unirse a la Comunidad</a></li>
                        <li><a href="#">Tarjetas de Regalo</a></li>
                        <li><a href="#">Feedback</a></li>
                        <li><a href="#">Carreras</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 The Ranger Hub. Todos los derechos reservados.</p>
                <div>
                    <a href="#">Política de Privacidad</a>
                    <a href="#">Términos de Servicio</a>
                    <a href="#">Configuración de Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;