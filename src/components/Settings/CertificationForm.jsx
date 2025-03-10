import React, { useState, useEffect } from "react";

// Formulario para añadir o editar certificaciones
const CertificationForm = ({ 
    username, 
    certificationData = null, 
    certificationId = null, 
    onCancel, 
    onSuccess, 
    setError, 
    setSuccess 
}) => {
    // Estado para el formulario
    const [formData, setFormData] = useState({
        title: "",
        issued_by: "",
        issued_date: "",
        valid_until: "",
        certification_number: "",
        document_url: ""
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Inicializar el formulario con datos para edición
    useEffect(() => {
        if (certificationData) {
            setFormData(certificationData);
        }
    }, [certificationData]);
    
    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Validar campos obligatorios
            const requiredFields = ['title', 'issued_by', 'issued_date', 'valid_until'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`El campo ${field} es obligatorio`);
                }
            }
            
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const userToFetch = username || "current";
            
            let url = `${API_BASE_URL}/rangers/${userToFetch}/certifications`;
            let method = "POST";
            
            // Si estamos editando, cambiamos la URL y el método
            if (certificationId) {
                url = `${API_BASE_URL}/rangers/${userToFetch}/certifications/${certificationId}`;
                method = "PUT";
            }
            
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error al ${certificationId ? 'actualizar' : 'añadir'} certificación`);
            }
            
            setSuccess(`Certificación ${certificationId ? 'actualizada' : 'añadida'} correctamente`);
            onSuccess();
            
        } catch (err) {
            console.error("Error submitting certification:", err);
            setError(err.message || `Error al ${certificationId ? 'actualizar' : 'añadir'} certificación`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="certification-form-container">
            <h4>{certificationId ? 'Editar' : 'Añadir'} Certificación</h4>
            <form onSubmit={handleSubmit}>
                {/* Título de la certificación */}
                <div className="form-group">
                    <label htmlFor="title">Título de la Certificación*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Ej: PADI Open Water, Wilderness First Responder"
                    />
                </div>
                
                {/* Entidad emisora */}
                <div className="form-group">
                    <label htmlFor="issued_by">Entidad Emisora*</label>
                    <input
                        type="text"
                        id="issued_by"
                        name="issued_by"
                        className="form-control"
                        value={formData.issued_by}
                        onChange={handleChange}
                        required
                        placeholder="Ej: PADI, NOLS, WFR"
                    />
                </div>
                
                {/* Fecha de emisión */}
                <div className="form-group">
                    <label htmlFor="issued_date">Fecha de Emisión*</label>
                    <input
                        type="date"
                        id="issued_date"
                        name="issued_date"
                        className="form-control"
                        value={formData.issued_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Fecha de validez */}
                <div className="form-group">
                    <label htmlFor="valid_until">Válido Hasta*</label>
                    <input
                        type="date"
                        id="valid_until"
                        name="valid_until"
                        className="form-control"
                        value={formData.valid_until}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Número de certificación */}
                <div className="form-group">
                    <label htmlFor="certification_number">Número de Certificación</label>
                    <input
                        type="text"
                        id="certification_number"
                        name="certification_number"
                        className="form-control"
                        value={formData.certification_number}
                        onChange={handleChange}
                        placeholder="Número o ID de tu certificación (opcional)"
                    />
                </div>
                
                {/* URL del documento */}
                <div className="form-group">
                    <label htmlFor="document_url">URL del Documento</label>
                    <input
                        type="text"
                        id="document_url"
                        name="document_url"
                        className="form-control"
                        value={formData.document_url}
                        onChange={handleChange}
                        placeholder="URL de tu certificado escaneado (opcional)"
                    />
                </div>
                
                <div className="form-buttons">
                    <button
                        type="submit"
                        className="save-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? (certificationId ? 'Actualizando...' : 'Añadiendo...') 
                            : (certificationId ? 'Actualizar' : 'Añadir')}
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificationForm;