import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import GuideOrExplorer from "./components/GuideOrExplorer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <MyNavbar />
      <div className="content-container"> {/* Ajusta el padding para evitar solapamiento */}
        <Routes>
          <Route path="/" element={<><HeroSection /><GuideOrExplorer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
