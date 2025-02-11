import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import GuideOrExplorer from "./components/GuideOrExplorer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import RangerDashboard from "./components/RangerDashBoard";

function App() {
  return (
    <Router>
      <MyNavbar />
      <div className="content-container"> {/* Ajusta el padding para evitar solapamiento */}
        <Routes>
          <Route path="/" element={<><HeroSection /><GuideOrExplorer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<RangerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
