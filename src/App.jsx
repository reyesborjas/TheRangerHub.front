{/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs";
// import RangerDashBoard from "./components/RangerDashBoard"; // Asegúrate de importarlo
import ContactUs from "./pages/ContactUs";
import CreateTrip from "./components/CreateTrip.jsx";
import { HomeDashboard } from "./pages/dashboard/HomeDashboard.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Activities } from "./pages/dashboard/Activities.jsx";
import { Trips } from "./pages/dashboard/Trips.jsx";
import CreateActivity from "./components/CreateActivity.jsx";
import { Resources } from "./pages/dashboard/Resources.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MyTrips } from "./pages/dashboard/MyTrips.jsx";


function App() {
  return (
    <Router>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<Dashboard /> }>
            <Route path="/dashboard/home" element={<HomeDashboard />}  />
            <Route path="/dashboard/trips" element={<Trips />}  />
            <Route path="/dashboard/createtrip" element={<CreateTrip/>}  />
            <Route path="/dashboard/mytrips" element={<MyTrips/>}  />
            <Route path="/dashboard/activities" element={<Activities />}  />
            <Route  path="/dashboard/resources" element={<Resources/>}  />
          </Route>
          <Route path="/createactivity" element={<CreateActivity />} />
          <Route path="/create-trip" element={<CreateTrip />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;*/}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import CreateTrip from "./components/CreateTrip.jsx";
import { HomeDashboard } from "./pages/dashboard/HomeDashboard.jsx";
import { Dashboard } from "./pages/Dashboard.jsx"; // Asegúrate que este componente renderice <Outlet />
import { Activities } from "./pages/dashboard/Activities.jsx";
import { Trips } from "./pages/dashboard/Trips.jsx";
import CreateActivity from "./components/CreateActivity.jsx";
import { Resources } from "./pages/dashboard/Resources.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MyTrips } from "./pages/dashboard/MyTrips.jsx";

function App() {
  return (
    <Router>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/*
            Aquí definimos la ruta "padre" con el parámetro :username.
            Todas las rutas hijas se definirán de forma relativa.
          */}
          <Route path="/secured/:username/dashboard" element={<Dashboard />}>
            <Route path="home" element={<HomeDashboard />} />
            <Route path="trips" element={<Trips />} />
            <Route path="createtrip" element={<CreateTrip />} />
            <Route path="mytrips" element={<MyTrips />} />
            <Route path="activities" element={<Activities />} />
            <Route path="resources" element={<Resources />} />
          </Route>

          {/* Otras rutas que no dependen del dashboard */}
          <Route path="/createactivity" element={<CreateActivity />} />
          <Route path="/create-trip" element={<CreateTrip />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

