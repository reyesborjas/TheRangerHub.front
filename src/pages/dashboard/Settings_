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
        title: "", // Título profesional
        languages: [],
        specialties: [],
        profilePicture: ""
    });
    
    // Estado para cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Lista de idiomas disponibles
    const availableLanguages = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán", 
        "Italiano", "Chino", "Japonés", "Ruso", "Árabe"
    ];
    
    // Lista de especialidades disponibles
    const availablespecialties = [
        "Scuba Diving", "Snorkeling", "Hiking", "Trekking",
        "Camping", "Kayaking", "Rock Climbing", "Mountaineering",
        "Wildlife Photography", "Bird Watching", "Ski", "Snowboard",
        "Canyoning", "Rafting", "Sandboard", "Cycling", "Rappel"
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

   
        useEffect(() => {
            const fetchUserProfile = async () => {
                try {
                    setIsLoading(true);
                    const userToFetch = username || "current";
                    const API_BASE_URL = "https://rangerhub-back.vercel.app";
                    
                    const response = await fetch(`${API_BASE_URL}/api/user-profile/${userToFetch}`, {
                        method: "GET", 
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
        
                    if (!response.ok) {
                        const text = await response.text();
                        console.error("API response:", text);
                        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
                    }
        
                    const userData = await response.json();
                    console.log("Datos del usuario cargados:", JSON.stringify(userData, null, 2));
        
                    // Extraer datos desde biography_extend si están disponibles
                    let languages = [];
                    let title = "";
                    let specialties = [];
                    
                    if (userData.biography_extend) {
                        try {
                            let bioExtend = userData.biography_extend;
                            if (typeof bioExtend === 'string') {
                                bioExtend = JSON.parse(bioExtend);
                            }
                            
                            // Extraer título profesional
                            if (bioExtend.title) {
                                title = bioExtend.title;
                            }
                            
                            // Extraer idiomas
                            if (bioExtend.languages && Array.isArray(bioExtend.languages)) {
                                languages = bioExtend.languages;
                            }
                            
                            // Extraer especialidades
                            if (bioExtend.specialties && Array.isArray(bioExtend.specialties)) {
                                specialties = bioExtend.specialties;
                            }
                            
                            console.log("Datos extraídos de biography_extend:", { title, languages, specialties });
                        } catch (e) {
                            console.error("Error al procesar biography_extend:", e);
                        }
                    }
        
                    // Asegúrate de que setProfileData se llame correctamente
                    setProfileData({
                        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                        email: userData.email || "",
                        nationality: userData.nationality || "", // Nacionalidad
                        country: userData.country || "", // País
                        region: userData.region || "",
                        postcode: userData.postcode || "",
                        title: title, // Título profesional extraído de biography_extend
                        languages: languages.length > 0 ? languages : (userData.languages || []),
                        specialties: specialties.length > 0 ? specialties : (userData.specialties || []),
                        profilePicture: userData.profilePicture || userData.profile_picture_url || ""
                    });
        
                    console.log("Estado del perfil actualizado:", profileData);
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
    
    // Manejar cambios en el formulario de contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        
        setPasswordData({
            ...passwordData,
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
    
    // Manejar cambios en los checkboxes de especialidades
    const handlespecialtiesyChange = (e) => {
        const { value, checked } = e.target;
    
        if (checked) {
            setProfileData({
                ...profileData,
                specialties: [...profileData.specialties, value]
            });
        } else {
            setProfileData({
                ...profileData,
                specialties: profileData.specialties.filter(spec => spec !== value)
            });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
    
        try {
            // Verifica que profileData tenga todos los campos necesarios
            console.log("Datos a enviar:", profileData);
            
            // Preparar datos para enviar con idiomas y título en biography_extend
            const biographyExtend = {
                languages: profileData.languages,
                title: profileData.title, // Incluir título profesional en biography_extend
                specialties: profileData.specialties // Incluir especialidades en biography_extend
            };
            
            const dataToSend = {
                email: profileData.email,
                nationality: profileData.nationality,
                country: profileData.country,
                region: profileData.region,
                postcode: profileData.postcode,
                profile_picture_url: profileData.profilePicture,
                biography_extend: biographyExtend
            };
            
            console.log("Datos a enviar con biography_extend:", dataToSend);
    
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const response = await fetch(`${API_BASE_URL}/api/user-profile/${username || "current"}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend) // Usar formato modificado con biography_extend
            });
    
            if (!response.ok) {
                let errorMessage = "Error al guardar los cambios";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
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
    
    // Función para cambiar la contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setError(null);
        setSuccess(null);
        
        try {
            // Validar que la nueva contraseña y la confirmación coincidan
            if (passwordData.new_password !== passwordData.confirm_password) {
                throw new Error("La nueva contraseña y su confirmación no coinciden");
            }
            
            // Validar longitud mínima
            if (passwordData.new_password.length < 8) {
                throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
            }
            
            // Preparar datos para enviar
            const dataToSend = {
                username: username,
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            };
            
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const response = await fetch(`${API_BASE_URL}/api/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });
            
            if (!response.ok) {
                let errorMessage = "Error al cambiar la contraseña";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    console.error("API error response:", errorText);
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            // Limpiar el formulario tras el éxito
            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });
            
            setSuccess("Contraseña actualizada correctamente");
        } catch (err) {
            console.error("Error changing password:", err);
            setError(err.message || "Error al cambiar la contraseña. Por favor, intenta más tarde.");
        } finally {
            setIsChangingPassword(false);
        }
    };
    
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Here you would typically upload the file to your backend
                // and update the profile picture URL
                console.log("File selected:", file);
                // Example: setProfileData({...profileData, profilePicture: reader.result});
            };
            reader.readAsDataURL(file);
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
                    className={`tab-button ${activeTab === "professional" ? "active" : ""}`}
                    onClick={() => setActiveTab("professional")}
                >
                    Perfil Profesional
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
                                        <img 
                                            src={profileData.profilePicture || profilePlaceholder} 
                                            alt="Foto de perfil" 
                                            onError={(e) => {
                                                e.target.src = profilePlaceholder;
                                            }}
                                        />
                                    </div>
                                    {/* Nuevo campo para la URL de la foto */}
                                    <div className="form-group">
                                        <label htmlFor="profilePicture">URL Foto de Perfil</label>
                                        <input
                                            type="text"
                                            id="profilePicture"
                                            name="profilePicture"
                                            className="form-control"
                                            value={profileData.profilePicture}
                                            onChange={handleChange}
                                            placeholder="Ingresa la URL de tu foto de perfil"
                                        />
                                    </div>
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

                {activeTab === "professional" && (
                    <div className="professional-profile">
                        <h3>Perfil Profesional</h3>

                        {isLoading ? (
                            <div className="loading-indicator">Cargando información del perfil...</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Título Profesional - Nuevo campo */}
                                <div className="form-group">
                                    <label htmlFor="title">Título Profesional</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="form-control"
                                        value={profileData.title}
                                        onChange={handleChange}
                                        placeholder="Ej: Instructor Deportivo, Guía de Montaña, etc."
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
                                
                                {/* Especialidades (checkboxes múltiples) */}
                                <div className="form-group">
                                    <label>Especialidades</label>
                                    <div className="specialtiesy-options">
                                        {availablespecialties.map(specialtiesy => (
                                            <div key={specialtiesy} className="specialtiesy-option">
                                                <input
                                                    type="checkbox"
                                                    id={`spec-${specialtiesy}`}
                                                    value={specialtiesy}
                                                    checked={profileData.specialties.includes(specialtiesy)}
                                                    onChange={handlespecialtiesyChange}
                                                />
                                                <label htmlFor={`spec-${specialtiesy}`}>{specialtiesy}</label>
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
                        
                        {isLoading ? (
                            <div className="loading-indicator">Cargando información de la cuenta...</div>
                        ) : (
                            <div className="account-sections">
                                {/* Sección de cambio de contraseña */}
                                <div className="password-section">
                                    <h4>Cambiar Contraseña</h4>
                                    <form onSubmit={handleChangePassword}>
                                        <div className="form-group">
                                            <label htmlFor="current_password">Contraseña Actual</label>
                                            <input
                                                type="password"
                                                id="current_password"
                                                name="current_password"
                                                className="form-control"
                                                value={passwordData.current_password}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="new_password">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                id="new_password"
                                                name="new_password"
                                                className="form-control"
                                                value={passwordData.new_password}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={8}
                                            />
                                            <small className="form-text text-muted">
                                                La contraseña debe tener al menos 8 caracteres.
                                            </small>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="confirm_password">Confirmar Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                id="confirm_password"
                                                name="confirm_password"
                                                className="form-control"
                                                value={passwordData.confirm_password}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="change-password-btn"
                                            disabled={isChangingPassword}
                                        >
                                            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Aquí puedes agregar otras secciones relacionadas con la cuenta si es necesario */}
                                <div className="account-security">
                                    <h4>Seguridad de la Cuenta</h4>
                                    <p>Mantén tu cuenta segura siguiendo estas recomendaciones:</p>
                                    <ul className="security-tips">
                                        <li>Usa contraseñas únicas para cada sitio web.</li>
                                        S<li>No compartas tus credenciales con nadie.</li>
                                        <li>Actualiza tu contraseña regularmente.</li>
                                    </ul>
                                </div>
                            </div>
                        )}
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