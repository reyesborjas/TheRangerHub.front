import React, { useState } from "react";
import "../styles/ContactUs.css";
import MyNavbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";

const ContactUs = () => {
    const [role, setRole] = useState("");
    const [showInfo, setShowInfo] = useState(null);

    const toggleInfo = (option) => {
        setShowInfo(showInfo === option ? null : option);
    };

    return (
        <>
            <MyNavbar />
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="contact-us-container">
                <div className="contact-form-wrapper">
                    <div className="contact-text">
                        <h1>
                            Gana, Descubre, Conéctate y <br />
                            Explora el Mundo con Nosotros.
                        </h1>
                        <p>
                            ¿Tienes preguntas, ideas o simplemente quieres saber más sobre The Ranger Hub?
                            <br />
                            ¡Estamos aquí para ayudarte!
                        </p>
                    </div>

                    <form className="contact-form">
                        <input
                            type="text"
                            placeholder="Nombre"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            required
                        />
                        <input
                            type="text"
                            placeholder="País"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Sitio Web o Redes Sociales (opcional)"
                        />

                        <label className="role-label">
                            ¿Quieres ser un Ranger o un Explorer?
                        </label>

                        <div className="role-options">
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="ranger"
                                    checked={role === "ranger"}
                                    onChange={() => setRole("ranger")}
                                />
                                Ranger
                                <span
                                    className="info-icon"
                                    onClick={() => toggleInfo("ranger")}
                                >
                                    i
                                </span>
                                {showInfo === "ranger" && (
                                    <div className="tooltip-info">
                                        <p><strong>🔴 Ranger:</strong> Gana dinero guiando experiencias únicas y compartiendo tu conocimiento local.</p>
                                    </div>
                                )}
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="explorer"
                                    checked={role === "explorer"}
                                    onChange={() => setRole("explorer")}
                                />
                                Explorer
                                <span
                                    className="info-icon"
                                    onClick={() => toggleInfo("explorer")}
                                >
                                    i
                                </span>
                                {showInfo === "explorer" && (
                                    <div className="tooltip-info">
                                        <p><strong>🟢 Explorer:</strong> Descubre aventuras personalizadas con guías locales expertos.</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <button type="submit" className="submit-btn">
                            Enviar mensaje
                        </button>

                        <p className="disclaimer">
                            📩 Al enviar este formulario, te contactaremos pronto vía email o WhatsApp.
                        </p>
                    </form>
                </div>
            </div>
            <br/>
            <br/>
            <Footer />
        </>
    );
};

export default ContactUs;
