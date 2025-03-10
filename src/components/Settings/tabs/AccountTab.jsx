import React, { useState } from "react";

const AccountTab = ({ username, setError, setSuccess }) => {
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Manejar cambios en el formulario de contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };
    
    // Cambiar contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setError(null);
        
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend)
            });
            
            if (!response.ok) {
                let errorMessage = "Error al cambiar la contraseña";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
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

    return (
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
                    
                    {/* Seguridad de la cuenta */}
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
    );
};

export default AccountTab;