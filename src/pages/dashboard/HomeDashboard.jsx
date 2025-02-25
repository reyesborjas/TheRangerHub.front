import React from "react";
import SideBarDashboard from "../../components/SideBarDashboard.jsx";
import TopNavbar from "../../components/TopNavbar.jsx";
import MainDashboard from "../../components/MainDashboard.jsx";
import "../../styles/HomeDashboard.css";
import RightPanel from "../../components/RightPanel.jsx"; // Asegúrate de importar estilos globales

export const HomeDashboard = () => {
    return (
        <div className="dashboard-layout">
            <SideBarDashboard />
            <div className="dashboard-content">
                <TopNavbar />

                {/* Contenedor que divide en 2 columnas: MainDashboard y RightPanel */}
                <div className="main-layout">
                    <MainDashboard />
                    <RightPanel />
                </div>
            </div>
        </div>
    );
};
