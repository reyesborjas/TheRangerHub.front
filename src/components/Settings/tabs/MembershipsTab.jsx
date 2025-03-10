import React from "react";

const MembershipsTab = () => {
    return (
        <div className="memberships-settings">
            <h3>Membresías</h3>
            <p>Gestiona tus membresías y suscripciones.</p>
            
            <div className="current-membership">
                <h4>Plan Actual</h4>
                <div className="membership-card">
                    <div className="membership-header">
                        <h5>Plan Básico</h5>
                        <span className="badge badge-active">Activo</span>
                    </div>
                    <div className="membership-details">
                        <p>Acceso a funcionalidades básicas de la plataforma.</p>
                        <p><strong>Renovación:</strong> Mensual</p>
                        <p><strong>Próximo pago:</strong> No aplicable</p>
                    </div>
                    <div className="membership-actions">
                        <button className="upgrade-btn" disabled>Mejorar Plan</button>
                    </div>
                </div>
            </div>
            
            <div className="available-plans">
                <h4>Planes Disponibles</h4>
                <p>Próximamente tendremos disponibles planes premium con más funcionalidades.</p>
            </div>
            
            <div className="membership-note">
                <p>Esta funcionalidad estará completamente disponible en futuras actualizaciones.</p>
            </div>
        </div>
    );
};

export default MembershipsTab;