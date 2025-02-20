import SideBarDashboard from "../components/SideBarDashboard.jsx";
import {Outlet } from "react-router-dom";
export const Dashboard = () => {
    return (
        <>
          <SideBarDashboard />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Outlet />
              </main>
        </>
      );
}