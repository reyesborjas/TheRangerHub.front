import React, { useState, useEffect, useMemo } from "react";
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
        title: "",
        languages: [],
        specialties: [],
        profilePicture: ""
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [certifications, setCertifications] = useState([]);
    const [isLoadingCertifications, setIsLoadingCertifications] = useState(false);
    const [newCertification, setNewCertification] = useState({
        title: "",
        issued_by: "",
        issued_date: "",
        valid_until: "",
        certification_number: "",
        document_url: ""
    });
    const [isAddingCertification, setIsAddingCertification] = useState(false);
    const [showAddCertificationForm, setShowAddCertificationForm] = useState(false);
    const [editingCertificationId, setEditingCertificationId] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    
    
    const availableLanguages = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán",
        "Italiano", "Chino", "Japonés", "Ruso", "Árabe"
    ];

    const availableSpecialties = [
        "Scuba Diving", "Snorkeling", "Hiking", "Trekking",
        "Camping", "Kayaking", "Rock Climbing", "Mountaineering",
        "Wildlife Photography", "Bird Watching", "Ski", "Snowboard",
        "Canyoning", "Rafting", "Sandboard", "Cycling", "Rappel"
    ];

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
        const fetchUserUUID = async (username) => {
            try {
                const response = await fetch(`https://rangerhub-back.vercel.app/api/users/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to fetch user UUID: ${response.status} ${response.statusText}`);
                }
        
                const userData = await response.json();
                return userData.id; // Assuming the UUID is returned in the 'id' field
            } catch (err) {
                console.error("Error fetching user UUID:", err);
                throw err;
            }
        };
        
        const fetchUserCertifications = async (uuid) => {
            setIsLoadingCertifications(true);
            setError(null);
        
            try {
                const API_BASE_URL = "https://rangerhub-back.vercel.app";
                const response = await fetch(`${API_BASE_URL}/rangers/${uuid}/certifications`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`Error al obtener certificaciones: ${response.status}`);
                }
        
                const data = await response.json();
                setCertifications(data.certifications || []);
        
            } catch (err) {
                console.error("Error fetching certifications:", err);
                setError("No se pudieron cargar las certificaciones. Por favor, intenta más tarde.");
            } finally {
                setIsLoadingCertifications(false);
            }
        };
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

                let languages = [];
                let title = "";
                let specialties = [];

                if (userData.biography_extend) {
                    try {
                        let bioExtend = userData.biography_extend;
                        if (typeof bioExtend === 'string') {
                            bioExtend = JSON.parse(bioExtend);
                        }

                        if (bioExtend.title) {
                            title = bioExtend.title;
                        }

                        if (bioExtend.languages && Array.isArray(bioExtend.languages)) {
                            languages = bioExtend.languages;
                        }

                        if (bioExtend.specialties && Array.isArray(bioExtend.specialties)) {
                            specialties = bioExtend.specialties;
                        }

                        console.log("Datos extraídos de biography_extend:", { title, languages, specialties });
                    } catch (e) {
                        console.error("Error al procesar biography_extend:", e);
                    }
                }

                setProfileData({
                    displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                    email: userData.email || "",
                    nationality: userData.nationality || "",
                    country: userData.country || "",
                    region: userData.region || "",
                    postcode: userData.postcode || "",
                    title: title,
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
    }, [username, activeTab]);

    useEffect(() => {
        if (activeTab === "certifications") {
            fetchUserCertifications();
        }
    }, [username, activeTab]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const fetchUserUUID = async (username) => {
        try {
            const response = await fetch(`https://rangerhub-back.vercel.app/api/users/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch user UUID: ${response.status} ${response.statusText}`);
            }
    
            const userData = await response.json();
            return userData.id; // Assuming the UUID is returned in the 'id' field
        } catch (err) {
            console.error("Error fetching user UUID:", err);
            throw err;
        }
    };
    
    const fetchUserCertifications = async (uuid) => {
        setIsLoadingCertifications(true);
        setError(null);
    
        try {
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const response = await fetch(`${API_BASE_URL}/rangers/${uuid}/certifications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener certificaciones: ${response.status}`);
            }
    
            const data = await response.json();
            setCertifications(data.certifications || []);
    
        } catch (err) {
            console.error("Error fetching certifications:", err);
            setError("No se pudieron cargar las certificaciones. Por favor, intenta más tarde.");
        } finally {
            setIsLoadingCertifications(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        setProfileData({
            ...profileData,
            languages: checked
                ? [...profileData.languages, value]
                : profileData.languages.filter(lang => lang !== value)
        });
    };

    const handleSpecialtiesChange = (e) => {
        const { value, checked } = e.target;
        setProfileData({
            ...profileData,
            specialties: checked
                ? [...profileData.specialties, value]
                : profileData.specialties.filter(spec => spec !== value)
        });
    };

    const handleCertificationChange = (e) => {
        const { name, value } = e.target;
        setNewCertification({
            ...newCertification,
            [name]: value
        });
    };

    const handleEditCertification = (certification) => {
        setNewCertification({
            title: certification.title || "",
            issued_by: certification.issued_by || "",
            issued_date: certification.issued_date ? certification.issued_date.split('T')[0] : "",
            valid_until: certification.valid_until ? certification.valid_until.split('T')[0] : "",
            certification_number: certification.certification_number || "",
            document_url: certification.document_url || ""
        });
        setEditingCertificationId(certification.id);
        setShowAddCertificationForm(true);
    };

    const handleCancelCertification = () => {
        setNewCertification({
            title: "",
            issued_by: "",
            issued_date: "",
            valid_until: "",
            certification_number: "",
            document_url: ""
        });
        setEditingCertificationId(null);
        setShowAddCertificationForm(false);
    };

    const handleSubmitCertification = async (e) => {
        e.preventDefault();
        setIsAddingCertification(true);
        setError(null);

        try {
            const requiredFields = ['title', 'issued_by', 'issued_date', 'valid_until'];
            for (const field of requiredFields) {
                if (!newCertification[field]) {
                    throw new Error(`El campo ${field} es obligatorio`);
                }
            }

            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const userToFetch = username || "current";

            let url = `${API_BASE_URL}/rangers/${userToFetch}/certifications`;
            let method = "POST";

            if (editingCertificationId) {
                url = `${API_BASE_URL}/rangers/${userToFetch}/certifications/${editingCertificationId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCertification)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error al ${editingCertificationId ? 'actualizar' : 'añadir'} certificación`);
            }

            setNewCertification({
                title: "",
                issued_by: "",
                issued_date: "",
                valid_until: "",
                certification_number: "",
                document_url: ""
            });

            setSuccess(`Certificación ${editingCertificationId ? 'actualizada' : 'añadida'} correctamente`);
            setEditingCertificationId(null);
            setShowAddCertificationForm(false);

            fetchUserCertifications();

        } catch (err) {
            console.error("Error submitting certification:", err);
            setError(err.message || `Error al ${editingCertificationId ? 'actualizar' : 'añadir'} certificación`);
        } finally {
            setIsAddingCertification(false);
        }
    };

    const handleDeleteCertification = async (certificationId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta certificación?")) {
            return;
        }

        setError(null);

        try {
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const userToFetch = username || "current";

            const response = await fetch(`${API_BASE_URL}/rangers/${userToFetch}/certifications/${certificationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al eliminar certificación");
            }

            setSuccess("Certificación eliminada correctamente");

            fetchUserCertifications();

        } catch (err) {
            console.error("Error deleting certification:", err);
            setError(err.message || "Error al eliminar certificación");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            console.log("Datos a enviar:", profileData);

            const biographyExtend = {
                languages: profileData.languages,
                title: profileData.title,
                specialties: profileData.specialties
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
                body: JSON.stringify(dataToSend)
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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setError(null);
        setSuccess(null);

        try {
            if (passwordData.new_password !== passwordData.confirm_password) {
                throw new Error("La nueva contraseña y su confirmación no coinciden");
            }

            if (passwordData.new_password.length < 8) {
                throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
            }

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
                console.log("File selected:", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No disponible";

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Configuración</h2>

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
                    className={`tab-button ${activeTab === "certifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("certifications")}
                >
                    Certificaciones
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

            <div className="settings-content">
                {activeTab === "basics" && (
                    <div className="profile-information">
                        <h3>Información de Perfil</h3>

                        {isLoading ? (
                            <div className="loading-indicator">Cargando información del perfil...</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
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

                                <div className="form-group">
                                    <label>Especialidades</label>
                                    <div className="specialty-options">
                                        {availableSpecialties.map(specialty => (
                                            <div key={specialty} className="specialty-option">
                                                <input
                                                    type="checkbox"
                                                    id={`spec-${specialty}`}
                                                    value={specialty}
                                                    checked={profileData.specialties.includes(specialty)}
                                                    onChange={handleSpecialtiesChange}
                                                />
                                                <label htmlFor={`spec-${specialty}`}>{specialty}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

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

                {activeTab === "certifications" && (
                    <div className="certifications-profile">
                        <h3>Certificaciones Profesionales</h3>

                        {isLoadingCertifications ? (
                            <div className="loading-indicator">Cargando certificaciones...</div>
                        ) : (
                            <div className="certifications-container">
                                {!showAddCertificationForm && (
                                    <button
                                        className="add-certification-btn"
                                        onClick={() => setShowAddCertificationForm(true)}
                                    >
                                        + Añadir Nueva Certificación
                                    </button>
                                )}
                            </div>
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

                                <div className="account-security">
                                    <h4>Seguridad de la Cuenta</h4>
                                    <p>Mantén tu cuenta segura siguiendo estas recomendaciones:</p>
                                    <ul className="security-tips">
                                        <li>Usa contraseñas únicas para cada sitio web.</li>
                                        <li>No compartas tus credenciales con nadie.</li>
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
                    </div>
                )}

                {activeTab === "memberships" && (
                    <div className="memberships-settings">
                        <h3>Membresías</h3>
                        <p>Gestiona tus membresías y suscripciones.</p>
                    </div>
                )}
            </div>

            {showAddCertificationForm && (
                <div className="certification-form-container">
                    <h4>{editingCertificationId ? 'Editar' : 'Añadir'} Certificación</h4>
                    <form onSubmit={handleSubmitCertification}>
                        <div className="form-group">
                            <label htmlFor="title">Título de la Certificación*</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={newCertification.title}
                                onChange={handleCertificationChange}
                                required
                                placeholder="Ej: PADI Open Water, Wilderness First Responder"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="issued_by">Entidad Emisora*</label>
                            <input
                                type="text"
                                id="issued_by"
                                name="issued_by"
                                className="form-control"
                                value={newCertification.issued_by}
                                onChange={handleCertificationChange}
                                required
                                placeholder="Ej: PADI, NOLS, WFR"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="issued_date">Fecha de Emisión*</label>
                            <input
                                type="date"
                                id="issued_date"
                                name="issued_date"
                                className="form-control"
                                value={newCertification.issued_date}
                                onChange={handleCertificationChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="valid_until">Válido Hasta*</label>
                            <input
                                type="date"
                                id="valid_until"
                                name="valid_until"
                                className="form-control"
                                value={newCertification.valid_until}
                                onChange={handleCertificationChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="certification_number">Número de Certificación</label>
                            <input
                                type="text"
                                id="certification_number"
                                name="certification_number"
                                className="form-control"
                                value={newCertification.certification_number}
                                onChange={handleCertificationChange}
                                placeholder="Número o ID de tu certificación (opcional)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="document_url">URL del Documento</label>
                            <input
                                type="text"
                                id="document_url"
                                name="document_url"
                                className="form-control"
                                value={newCertification.document_url}
                                onChange={handleCertificationChange}
                                placeholder="URL de tu certificado escaneado (opcional)"
                            />
                        </div>

                        <div className="form-buttons">
                            <button
                                type="submit"
                                className="save-btn"
                                disabled={isAddingCertification}
                            >
                                {isAddingCertification
                                    ? (editingCertificationId ? 'Actualizando...' : 'Añadiendo...')
                                    : (editingCertificationId ? 'Actualizar' : 'Añadir')}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelCertification}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isLoadingCertifications && certifications.length === 0 && !showAddCertificationForm && (
                <div className="no-certifications">
                    <p>No tienes certificaciones registradas actualmente.</p>
                </div>
            )}

            {certifications.length > 0 && (
                <div className="certifications-list">
                    <h4>Mis Certificaciones</h4>
                    <div className="certification-cards">
                        {certifications.map(cert => (
                            <div key={cert.id} className="certification-card">
                                <div className="certification-header">
                                    <h5>{cert.title}</h5>
                                    <div className="certification-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditCertification(cert)}
                                            title="Editar"
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteCertification(cert.id)}
                                            title="Eliminar"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="certification-details">
                                    <p><strong>Entidad:</strong> {cert.issued_by}</p>
                                    <p><strong>Emitido:</strong> {formatDate(cert.issued_date)}</p>
                                    <p><strong>Válido hasta:</strong> {formatDate(cert.valid_until)}</p>
                                    {cert.certification_number && (
                                        <p><strong>Número:</strong> {cert.certification_number}</p>
                                    )}
                                    {cert.document_url && (
                                        <p>
                                            <strong>Documento:</strong>
                                            <a href={cert.document_url} target="_blank" rel="noopener noreferrer">
                                                Ver certificado
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
