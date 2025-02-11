import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
// import AboutUs from "./components/AboutUs";
// import ContactUs from "./components/ContactUs";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
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
}

export default App;
