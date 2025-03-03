import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../styles/TopNavbar.css";

const TopNavbar = () => {
    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error al parsear el usuario:", error);
            }
        }
    };

    useEffect(() => {
        loadUser(); 

        const handleStorageChange = () => {
            loadUser();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <nav className="top-navbar">
            {/* Sección Izquierda */}
            <div className="nav-left">
                {/* Barra de búsqueda */}
                <div className="search-bar">
                    <input type="text" placeholder="Buscar..." />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
            </div>

            {/* Sección Derecha: Usuario */}
            <div className="nav-right">
                {user ? (
                    <>
                        <span className="user-name">{user.name}</span>
                        <img src={user.profilePic} alt={user.name} className="user-avatar" />
                    </>
                ) : (
                    <span>Cargando usuario...</span>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;
