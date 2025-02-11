import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/Navbar";
<<<<<<< HEAD
import Home from "./pages/Home.jsx";
// import AboutUs from "./components/AboutUs";
// import ContactUs from "./components/ContactUs";
=======
import AboutUs from "./components/AboutUs.jsx";
import HeroSection from "./components/HeroSection";
import GuideOrExplorer from "./components/GuideOrExplorer";
>>>>>>> clara
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
<<<<<<< HEAD
    return (
        <Router>
            <MyNavbar />
            <div className="content-container"> {/* Adjust padding to avoid overlap */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    { /* <Route path="/about-us" element={<AboutUs />} /> */}
                    { /*<Route path="/contact-us" element={<ContactUs />} /> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </Router>
    );
=======
  return (
    <Router>
      <MyNavbar />
      <div className="content-container"> {/* Ajusta el padding para evitar solapamiento */}
        <Routes>
          <Route path="/" element={<><HeroSection /><GuideOrExplorer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/AboutUs" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
>>>>>>> clara
}

export default App;
