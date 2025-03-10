import React from "react";

const NotificationsTab = () => {
    return (
        <div className="notifications-settings">
            <h3>Notificaciones</h3>
            <p>Configura qué notificaciones deseas recibir y cómo quieres recibirlas.</p>
            
            <div className="notification-options">
                <div className="notification-group">
                    <h4>Notificaciones por Email</h4>
                    <div className="option-item">
                        <input type="checkbox" id="email-notifications" />
                        <label htmlFor="email-notifications">Recibir notificaciones por email</label>
                    </div>
                    <div className="option-item">
                        <input type="checkbox" id="email-marketing" />
                        <label htmlFor="email-marketing">Recibir boletines y ofertas</label>
                    </div>
                </div>
                
                <div className="notification-group">
                    <h4>Notificaciones del Sistema</h4>
                    <div className="option-item">
                        <input type="checkbox" id="new-message" defaultChecked />
                        <label htmlFor="new-message">Nuevos mensajes</label>
                    </div>
                    <div className="option-item">
                        <input type="checkbox" id="booking-notification" defaultChecked />
                        <label htmlFor="booking-notification">Reservas y cambios</label>
                    </div>
                    <div className="option-item">
                        <input type="checkbox" id="system-updates" />
                        <label htmlFor="system-updates">Actualizaciones del sistema</label>
                    </div>
                </div>
            </div>
            
            <div className="form-group">
                <button className="save-btn" disabled>
                    Guardar Preferencias
                </button>
                <p className="form-note">
                    Esta funcionalidad estará disponible próximamente.
                </p>
            </div>
        </div>
    );
};

export default NotificationsTab;