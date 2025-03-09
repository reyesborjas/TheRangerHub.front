import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Settings.css";
import profilePlaceholder from "../../../public/ranger.jpg";

export const Settings = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("basics");
    const [profileData, setProfileData] = useState({
        displayName: "",
        email: "",
        nationality: "",
        country: "",
        region: "",
        postcode: "",
        languages: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Lista de idiomas disponibles
    const availableLanguages = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán", 
        "Italiano", "Chino", "Japonés", "Ruso", "Árabe"
    ];
    
    // Regiones según el país seleccionado
    const getRegionsByCountry = (country) => {
        const regionMap = {
            "Chile": ["Santiago", "Valparaíso", "Biobío", "Araucanía", "Antofagasta", "Coquimbo", "Los Lagos"],
            "Argentina": ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"],
            "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla"],
            "Peru": ["Lima", "Arequipa", "Cusco", "Trujillo"],
            "Mexico": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"]
        };
        
        return regionMap[country] || ["Otra"];
    };

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                // Use the current user's username from URL params or get from auth context
                const userToFetch = username || "current"; // You might want to implement a route for "current" user
                
                const API_BASE_URL = "https://rangerhub-back.vercel.app";
                const response = await fetch(`${API_BASE_URL}/api/user-profile/${userToFetch}`);
                
                if (!response.ok) {
                    const text = await response.text();
                    console.error("API response:", text);
                    throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
                }
                
                const userData = await response.json();
                console.log("Profile data loaded:", userData);
                
                // Map the API response to our form state
                setProfileData({
                    displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
                    email: userData.email || "",
                    nationality: userData.nationality || "Chile",
                    country: userData.country || "Chile",
                    region: userData.region || "Santiago",
                    postcode: userData.postcode || "",
                    languages: userData.languages || []
                });
                
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("No se pudo cargar la información del perfil. Por favor, intenta más tarde.");
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    // Auto-hide success message after 5 seconds
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
    
    // Manejar cambios en los checkboxes de idiomas
    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        
        if (checked) {
            // Agregar el idioma si no está en la lista
            setProfileData({
                ...profileData,
                languages: [...profileData.languages, value]
            });
        } else {
            // Remover el idioma si está marcado
            setProfileData({
                ...profileData,
                languages: profileData.languages.filter(lang => lang !== value)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        
        try {
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const response = await fetch(`${API_BASE_URL}/api/user-profile/${username || "current"}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });
            
            if (!response.ok) {
                let errorMessage = "Error al guardar los cambios";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Si no podemos parsear JSON, intentamos obtener el texto
                    const errorText = await response.text();
                    console.error("API error response:", errorText);
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            setSuccess("Cambios guardados correctamente");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.message || "Error al guardar los cambios. Por favor, intenta más tarde.");
        } finally {
            setIsSaving(false);
        }
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

                        {isLoading ? (
                            <div className="loading-indicator">Cargando información del perfil...</div>
                        ) : (
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
                                
                                {/* Nacionalidad (campo de texto libre) */}
                                <div className="form-group">
                                    <label htmlFor="nationality">Nacionalidad</label>
                                    <input
                                        type="text"
                                        id="nationality"
                                        name="nationality"
                                        className="form-control"
                                        value={profileData.nationality}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* País de residencia */}
                                <div className="form-group">
                                    <label htmlFor="country">País de residencia</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        className="form-control"
                                        value={profileData.country}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Región/Estado - Estructura simplificada */}
                                <div className="form-group">
                                    <label htmlFor="region">Región/Estado</label>
                                    <select
                                        id="region"
                                        name="region"
                                        className="form-control"
                                        value={profileData.region}
                                        onChange={handleChange}
                                    >
                                        {getRegionsByCountry(profileData.country).map(region => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
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
                                
                                {/* Idiomas (checkboxes múltiples) */}
                                <div className="form-group">
                                    <label>Idiomas que hablas</label>
                                    <div className="language-options">
                                        {availableLanguages.map(language => (
                                            <div key={language} className="language-option">
                                                <input
                                                    type="checkbox"
                                                    id={`lang-${language}`}
                                                    value={language}
                                                    checked={profileData.languages.includes(language)}
                                                    onChange={handleLanguageChange}
                                                />
                                                <label htmlFor={`lang-${language}`}>{language}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                <div className="form-group">
                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        )}
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