import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import BlogHome from "./pages/BlogHome.jsx";
import CreateTrip from "./components/CreateTrip.jsx";
import { HomeDashboard } from "./pages/dashboard/HomeDashboard.jsx";
import { Dashboard } from "./pages/Dashboard.jsx"; // Asegúrate que este componente renderice <Outlet />
import { Activities } from "./pages/dashboard/Activities.jsx";
import { Trips } from "./pages/dashboard/Trips.jsx";
import CreateActivity from "./components/CreateActivity.jsx";
import { Resources } from "./pages/dashboard/Resources.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MyTrips } from "./pages/dashboard/MyTrips.jsx";
import {Settings} from "./pages/dashboard/Settings.jsx";
import Rangers from "./pages/dashboard/Rangers.jsx";
import Blog from "./pages/dashboard/Blog.jsx";
import Comentarios from "./pages/dashboard/Comentarios.jsx";


function App() {
  return (
    <Router>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blog-home" element={<BlogHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          
          <Route path="/secured/:username/dashboard" element={<Dashboard />}>
            <Route path="home" element={<HomeDashboard />} />
            <Route path="trips" element={<Trips />} />
            <Route path="createtrip" element={<CreateTrip />} />
            <Route path="createactivity" element={<CreateActivity />} />
            <Route path="mytrips" element={<MyTrips />} />
            <Route path="activities" element={<Activities />} />
            <Route path="resources" element={<Resources />} />
            <Route path="rangers" element={<Rangers />} />
            <Route path="configuracion" element={<Settings />} />
            <Route path="blog" element={<Blog />} />
            <Route path="comentarios" element={<Comentarios />} />
          </Route>

          <Route path="/createactivity" element={<CreateActivity />} />
          <Route path="/create-trip" element={<CreateTrip />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

