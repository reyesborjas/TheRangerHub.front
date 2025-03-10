import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Settings.css";

// Importación de subcomponentes
import BasicInfoTab from "../../components/Settings/tabs/BasicInfoTab";
import ProfessionalTab from "../../components/Settings/tabs/ProfessionalTab";
import CertificationsTab from "../../components/Settings/tabs/CertificationsTab";
import AccountTab from "../../components/Settings/tabs/AccountTab";
import NotificationsTab from "../../components/Settings/tabs/NotificationsTab";
import MembershipsTab from "../../components/Settings/tabs/MembershipsTab";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useFeedback } from "../../hooks/useFeedback";

export const Settings = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("basics");
    
    // Usar hooks personalizados para manejar el perfil y el feedback
    const { 
        profileData, 
        isLoading, 
        isSaving, 
        handleChange, 
        handleLanguageChange, 
        handleSpecialtiesChange, 
        handleSubmit
    } = useUserProfile(username);
    
    const { error, success, setError, setSuccess } = useFeedback();
    
    // Configuración de tabs
    const tabs = [
        { id: "basics", label: "Información Básica" },
        { id: "professional", label: "Perfil Profesional" },
        { id: "certifications", label: "Certificaciones" },
        { id: "account", label: "Cuenta" },
        { id: "notifications", label: "Notificaciones" },
        { id: "memberships", label: "Membresías" }
    ];

    // Renderizar el contenido basado en el tab activo
    const renderTabContent = () => {
        switch (activeTab) {
            case "basics":
                return (
                    <BasicInfoTab 
                        profileData={profileData}
                        isLoading={isLoading}
                        isSaving={isSaving}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />
                );
            case "professional":
                return (
                    <ProfessionalTab 
                        profileData={profileData}
                        isLoading={isLoading}
                        isSaving={isSaving}
                        handleChange={handleChange}
                        handleLanguageChange={handleLanguageChange}
                        handleSpecialtiesChange={handleSpecialtiesChange}
                        handleSubmit={handleSubmit}
                    />
                );
            case "certifications":
                return <CertificationsTab username={username} setError={setError} setSuccess={setSuccess} />;
            case "account":
                return <AccountTab username={username} setError={setError} setSuccess={setSuccess} />;
            case "notifications":
                return <NotificationsTab />;
            case "memberships":
                return <MembershipsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Configuración</h2>

            {/* Pestañas de navegación */}
            <div className="settings-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
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
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Settings;