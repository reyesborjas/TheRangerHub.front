import React from "react";
import '../../../styles/Settings.css';

const ProfessionalTab = ({ 
    profileData, 
    isLoading, 
    isSaving, 
    handleChange, 
    handleLanguageChange, 
    handleSpecialtiesChange, 
    handleSubmit 
}) => {
    // Lista de idiomas disponibles
    const availableLanguages = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán", 
        "Italiano", "Chino", "Japonés", "Ruso", "Árabe"
    ];
    
    // Lista de especialidades disponibles
    const availableSpecialties = [
        "Scuba Diving", "Snorkeling", "Hiking", "Trekking",
        "Camping", "Kayaking", "Rock Climbing", "Mountaineering",
        "Wildlife Photography", "Bird Watching", "Ski", "Snowboard",
        "Canyoning", "Rafting", "Sandboard", "Cycling", "Rappel"
    ];
    
    if (isLoading) {
        return <div className="loading-indicator">Cargando información del perfil...</div>;
    }

    return (
        <div className="professional-profile">
            <h3>Perfil Profesional</h3>

            <form onSubmit={handleSubmit}>
                {/* Título Profesional */}
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
        </div>
    );
};

export default ProfessionalTab;