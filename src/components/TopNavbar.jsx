// TopNavbar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../styles/TopNavbar.css";

const user = {
    name: "José Reyes",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
};

const TopNavbar = () => {
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
                <span className="user-name">{user.name}</span>
                <img src={user.profilePic} alt="Usuario" className="user-avatar" />
            </div>
        </nav>
    );
};

export default TopNavbar;