import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs";
import RangerDashBoard from "./components/RangerDashBoard"; // Asegúrate de importarlo
// import ContactUs from "./components/ContactUs";

function App() {
    return (
        <Router>
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    { /*<Route path="/contact-us" element={<ContactUs />} /> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<RangerDashBoard />} /> {/* Nueva ruta agregada */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

