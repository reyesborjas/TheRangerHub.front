import React, { useState } from 'react'; 
import SideBarDashboard from "../components/SideBarDashboard.jsx";
import { Outlet, useParams } from "react-router-dom";

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { username } = useParams();
  console.log(username);
  
  return (
    <>
      <SideBarDashboard />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Outlet context={{ searchTerm, setSearchTerm }}/>
      </main>
    </>
  );
}
