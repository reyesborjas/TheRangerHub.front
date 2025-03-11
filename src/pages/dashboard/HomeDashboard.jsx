import React, { useState, useEffect } from "react";
import SideBarDashboard from "../../components/SideBarDashboard.jsx";
import TopNavbar from "../../components/TopNavbar.jsx";
import MainDashboard from "../../components/MainDashboard.jsx";
import "../../styles/HomeDashboard.css";
import RightPanel from "../../components/RightPanel.jsx";

export const HomeDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <SideBarDashboard isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="dashboard-content">
                <TopNavbar toggleSidebar={toggleSidebar} />

                <div className="main-layout">
                    <MainDashboard />
                    <RightPanel />
                </div>
            </div>
        </div>
    );
};