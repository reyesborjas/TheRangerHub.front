import React from "react";
import profilePlaceholder from "../../../../public/ranger.jpg";
import { getRegionsByCountry } from "/./utils/regionHelper";

const BasicInfoTab = ({ profileData, isLoading, isSaving, handleChange, handleSubmit }) => {
    if (isLoading) {
        return <div className="loading-indicator">Cargando información del perfil...</div>;
    }

    return (
        <div className="profile-information">
            <h3>Información de Perfil</h3>
            <form onSubmit={handleSubmit}>
                {/* Foto de perfil */}
                <div className="profile-section">
                    <h4>Perfil</h4>
                    <div className="profile-picture-container">
                        <div className="profile-picture">
                            <img 
                                src={profileData.profilePicture || profilePlaceholder} 
                                alt="Foto de perfil" 
                                onError={(e) => { e.target.src = profilePlaceholder; }}
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
                
                {/* Nacionalidad */}
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

                {/* Región/Estado */}
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
                            <option key={region} value={region}>{region}</option>
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
        </div>
    );
};

export default BasicInfoTab;