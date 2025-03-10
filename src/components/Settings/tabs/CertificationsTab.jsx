import React, { useState, useEffect } from "react";
import CertificationForm from "../CertificationForm";
import CertificationCard from "../CertificationCard";

const CertificationsTab = ({ username, setError, setSuccess }) => {
    const [certifications, setCertifications] = useState([]);
    const [isLoadingCertifications, setIsLoadingCertifications] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCertificationId, setEditingCertificationId] = useState(null);
    const [editingCertification, setEditingCertification] = useState(null);
    
    // Cargar certificaciones
    useEffect(() => {
        fetchCertifications();
    }, [username]);
    
    const fetchCertifications = async () => {
        setIsLoadingCertifications(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            
            const response = await fetch(`${API_BASE_URL}/rangers/${tokenPayload.user_id}/certifications`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Server error details:`, errorText);
                throw new Error(`Error al obtener certificaciones: ${response.status}`);
            }
            
            const data = await response.json();
            setCertifications(data.certifications || []);
            
        } catch (err) {
            console.error("Error fetching certifications:", err);
            setError(`No se pudieron cargar las certificaciones: ${err.message}`);
        } finally {
            setIsLoadingCertifications(false);
        }
    };

    // Manejar la edición de una certificación
    const handleEditCertification = (cert) => {
        setEditingCertificationId(cert.id);
        setEditingCertification({
            title: cert.title || "",
            issued_by: cert.issued_by || "",
            issued_date: cert.issued_date ? cert.issued_date.split('T')[0] : "",
            valid_until: cert.valid_until ? cert.valid_until.split('T')[0] : "",
            certification_number: cert.certification_number || "",
            document_url: cert.document_url || ""
        });
        setShowAddForm(true);
    };
    
    // Manejar la eliminación de una certificación
    const handleDeleteCertification = async (certificationId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta certificación?")) {
            return;
        }
        
        try {
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const userToFetch = username || "current";
            
            const response = await fetch(`${API_BASE_URL}/rangers/${userToFetch}/certifications/${certificationId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            
            if (!response.ok) {
                throw new Error("Error al eliminar certificación");
            }
            
            setSuccess("Certificación eliminada correctamente");
            fetchCertifications();
            
        } catch (err) {
            console.error("Error deleting certification:", err);
            setError(err.message || "Error al eliminar certificación");
        }
    };
    
    // Cancelar la edición o creación
    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingCertificationId(null);
        setEditingCertification(null);
    };
    
    // Cuando se completa una operación de guardar
    const handleFormSuccess = () => {
        setShowAddForm(false);
        setEditingCertificationId(null);
        setEditingCertification(null);
        fetchCertifications();
    };
    
    // Formatear fecha para mostrar
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

    if (isLoadingCertifications) {
        return <div className="loading-indicator">Cargando certificaciones...</div>;
    }

    return (
        <div className="certifications-profile">
            <h3>Certificaciones Profesionales</h3>
            
            <div className="certifications-container">
                {/* Botón para agregar nueva certificación */}
                {!showAddForm && (
                    <button 
                        className="add-certification-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Añadir Nueva Certificación
                    </button>
                )}
                
                {/* Formulario para agregar/editar certificación */}
                {showAddForm && (
                    <CertificationForm 
                        username={username}
                        certificationData={editingCertification}
                        certificationId={editingCertificationId}
                        onCancel={handleCancelForm}
                        onSuccess={handleFormSuccess}
                        setError={setError}
                        setSuccess={setSuccess}
                    />
                )}
                
                {/* Lista de certificaciones */}
                {!isLoadingCertifications && certifications.length === 0 && !showAddForm && (
                    <div className="no-certifications">
                        <p>No tienes certificaciones registradas actualmente.</p>
                    </div>
                )}
                
                {certifications.length > 0 && (
                    <div className="certifications-list">
                        <h4>Mis Certificaciones</h4>
                        <div className="certification-cards">
                            {certifications.map(cert => (
                                <CertificationCard 
                                    key={cert.id}
                                    certification={cert}
                                    onEdit={() => handleEditCertification(cert)}
                                    onDelete={() => handleDeleteCertification(cert.id)}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificationsTab;