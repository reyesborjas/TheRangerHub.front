// pages/dashboard/Settings.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Settings.css";
import profilePlaceholder from "../../../public/ranger.jpg";

export const Settings = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("basics");
    const [profileData, setProfileData] = useState({
        displayName: username || "Usuario Ranger",
        email: "usuario@rangerhub.com",
        country: "Chile",
        region: "Santiago",
        postcode: "7500000"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Auto-ocultar mensaje de éxito después de 5 segundos
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulación de guardado (reemplazar con llamada API real cuando esté disponible)
        setTimeout(() => {
            setIsLoading(false);
            setSuccess("Cambios guardados correctamente");
            // Aquí iría el código para enviar los datos al backend
        }, 800);
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Configuración</h2>

            {/* Pestañas de navegación */}
            <div className="settings-tabs">
                <button
                    className={`tab-button ${activeTab === "basics" ? "active" : ""}`}
                    onClick={() => setActiveTab("basics")}
                >
                    Información Básica
                </button>
                <button
                    className={`tab-button ${activeTab === "account" ? "active" : ""}`}
                    onClick={() => setActiveTab("account")}
                >
                    Cuenta
                </button>
                <button
                    className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("notifications")}
                >
                    Notificaciones
                </button>
                <button
                    className={`tab-button ${activeTab === "memberships" ? "active" : ""}`}
                    onClick={() => setActiveTab("memberships")}
                >
                    Membresías
                </button>
            </div>

            {/* Mensajes de feedback */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            {/* Contenido basado en la pestaña activa */}
            <div className="settings-content">
                {activeTab === "basics" && (
                    <div className="profile-information">
                        <h3>Información de Perfil</h3>

                        <form onSubmit={handleSubmit}>
                            {/* Foto de perfil */}
                            <div className="profile-section">
                                <h4>Perfil</h4>
                                <div className="profile-picture-container">
                                    <div className="profile-picture">
                                        <img src={profilePlaceholder} alt="Foto de perfil" />
                                    </div>
                                    <button type="button" className="upload-photo-btn">
                                        Subir foto
                                    </button>
                                </div>
                            </div>

                            {/* Nombre para mostrar */}
                            <div className="form-group">
                                <label htmlFor="displayName">Nombre para mostrar</label>
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    className="form-control"
                                    value={profileData.displayName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={profileData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* País de residencia */}
                            <div className="form-group">
                                <label htmlFor="country">País de residencia</label>
                                <div className="select-wrapper">
                                    <select
                                        id="country"
                                        name="country"
                                        className="form-control"
                                        value={profileData.country}
                                        onChange={handleChange}
                                    >
                                        <option value="Chile">Chile</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Peru">Perú</option>
                                        <option value="Mexico">México</option>
                                    </select>
                                </div>
                            </div>

                            {/* Región/Estado */}
                            <div className="form-group">
                                <label htmlFor="region">Región/Estado</label>
                                <div className="select-wrapper">
                                    <select
                                        id="region"
                                        name="region"
                                        className="form-control"
                                        value={profileData.region}
                                        onChange={handleChange}
                                    >
                                        <option value="Santiago">Santiago</option>
                                        <option value="Valparaíso">Valparaíso</option>
                                        <option value="Biobío">Biobío</option>
                                        <option value="Araucanía">Araucanía</option>
                                    </select>
                                </div>
                            </div>

                            {/* Código postal */}
                            <div className="form-group">
                                <label htmlFor="postcode">Código postal</label>
                                <input
                                    type="text"
                                    id="postcode"
                                    name="postcode"
                                    className="form-control"
                                    value={profileData.postcode}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Botón de guardar */}
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "account" && (
                    <div className="account-settings">
                        <h3>Configuración de la Cuenta</h3>
                        <p>Aquí podrás gestionar los ajustes de tu cuenta, como cambio de contraseña y preferencias de seguridad.</p>
                        {/* Contenido de ajustes de cuenta (estático por ahora) */}
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="notifications-settings">
                        <h3>Notificaciones</h3>
                        <p>Configura qué notificaciones deseas recibir y cómo quieres recibirlas.</p>
                        {/* Contenido de notificaciones (estático por ahora) */}
                    </div>
                )}

                {activeTab === "memberships" && (
                    <div className="memberships-settings">
                        <h3>Membresías</h3>
                        <p>Gestiona tus membresías y suscripciones.</p>
                        {/* Contenido de membresías (estático por ahora) */}
                    </div>
                )}
            </div>
        </div>
    );
};