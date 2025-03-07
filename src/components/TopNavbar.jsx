import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/TopNavbar.css";

const TopNavbar = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Función para obtener los datos del usuario de múltiples fuentes posibles
        const getUserData = () => {
            setLoading(true);

            try {
                // 1. Intentar obtener desde el token JWT
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const decoded = JSON.parse(atob(token.split(".")[1]));
                        if (decoded) {
                            setUserData({
                                firstName: decoded.first_name ||
                                    (decoded.name ? decoded.name.split(' ')[0] : null) ||
                                    decoded.username ||
                                    username ||
                                    "Usuario",
                                username: decoded.username,
                                role: decoded.role_name
                            });
                            setLoading(false);
                            return;
                        }
                    } catch (err) {
                        console.error("Error al decodificar el token:", err);
                    }
                }

                // 2. Intentar obtener desde localStorage (user)
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserData({
                        firstName: parsedUser.first_name ||
                            (parsedUser.name ? parsedUser.name.split(' ')[0] : null) ||
                            parsedUser.username ||
                            username ||
                            "Usuario",
                        username: parsedUser.username,
                        role: parsedUser.role_name
                    });
                    setLoading(false);
                    return;
                }

                // 3. Intentar obtener desde localStorage (currentUser)
                const currentUser = localStorage.getItem("currentUser");
                if (currentUser) {
                    const parsedCurrentUser = JSON.parse(currentUser);
                    setUserData({
                        firstName: parsedCurrentUser.first_name ||
                            (parsedCurrentUser.name ? parsedCurrentUser.name.split(' ')[0] : null) ||
                            parsedCurrentUser.username ||
                            username ||
                            "Usuario",
                        username: parsedCurrentUser.username,
                        role: parsedCurrentUser.role_name
                    });
                    setLoading(false);
                    return;
                }

                // 4. Si todo falla, usar el nombre de usuario de la URL
                if (username) {
                    setUserData({
                        firstName: username,
                        username: username,
                        role: "Usuario"
                    });
                    setLoading(false);
                    return;
                }

                // Si no hay datos de usuario en ningún lado
                setUserData({
                    firstName: "Usuario",
                    username: "guest",
                    role: "Visitante"
                });
                setLoading(false);

            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setUserData({
                    firstName: "Usuario",
                    username: "guest",
                    role: "Visitante"
                });
                setLoading(false);
            }
        };

        getUserData();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            getUserData();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [username]);

    // Determinar si el usuario es un Ranger
    const isRanger = userData?.role?.toLowerCase() === "ranger";

    // Función segura para obtener la inicial
    const getInitial = () => {
        if (!userData || !userData.firstName) return "?";
        return userData.firstName.charAt(0).toUpperCase();
    };

    return (
        <nav className="top-navbar">
            {/* Sección Izquierda */}
            <div className="nav-left">
            </div>

            {/* Sección Derecha: Usuario */}
            <div className="nav-right">
                {loading ? (
                    <div className="loading-indicator">Cargando...</div>
                ) : userData ? (
                    <>
                        <span className="greeting">Hola,</span>
                        <span className={`user-name ${isRanger ? 'ranger-name' : ''}`}>
                            {`${userData.firstName}!` || "Usuario!"}
                        </span>
                        {userData.role && (
                            <span className="user-role">{userData.role}</span>
                        )}
                        <div className={`user-initial ${isRanger ? 'ranger-initial' : ''}`}>
                            {getInitial()}
                        </div>
                    </>
                ) : (
                    <span className="no-user">Usuario no identificado</span>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;