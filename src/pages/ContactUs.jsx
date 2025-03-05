import React, { useState } from "react";
import "../styles/ContactUs.css";
import MyNavbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
    const [showInfo, setShowInfo] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        website: "",
        role: "", 
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: type === "radio" ? value : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .send(
                "service_jv0zrdu",
                "template_8l1mjue",
                formData,
                "kGtI2shRo6JdImB3H"
            )
            .then(
                () => alert("Correo enviado correctamente"),
                (error) => console.error("Error al enviar:", error)
            );
    };

    const toggleInfo = (option) => {
        setShowInfo(showInfo === option ? null : option);
    };

    return (
        <>
            <MyNavbar />
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

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo Electrónico"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Teléfono"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="País"
                            required
                            value={formData.country}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="website"
                            placeholder="Sitio Web o Redes Sociales (opcional)"
                            value={formData.website}
                            onChange={handleChange}
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
                                    checked={formData.role === "ranger"}
                                    onChange={handleChange}
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
                                    checked={formData.role === "explorer"}
                                    onChange={handleChange}
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
            <br />
            <br />
            <Footer />
        </>
    );
};

export default ContactUs;
