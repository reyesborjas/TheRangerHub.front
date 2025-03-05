import React, {useState} from 'react';
import GuideOrExplorer from "../components/GuideOrExplorer.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Estadisticas from "../components/Estadisticas.jsx";
import "../styles/HeroSection.css";
import CtaSection from "../components/CtaSection.jsx";
import Footer from "../components/Footer.jsx";
import MyNavbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [backgroundImage, setBackgroundImage] = useState("/Torres.jpeg");
    const navigate = useNavigate();

    return (
        <section
            className="hero"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="hero-content text-center">
                <h1>Gana dinero siendo guía o Explora el mundo</h1>
                <p>
                    Comparte tus conocimientos, crea experiencias inolvidables,
                    o encuentra aventuras únicas en todo el mundo.
                </p>
                <div className="hero-buttons">
                    <button
                        className="btn-ranger"
                        onMouseEnter={() => setBackgroundImage("/public/ranger.jpg")}
                        onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
                        onClick={() => navigate("/signup")}
                    >
                        Conviértete en Ranger
                    </button>
                    <button
                        className="btn-explorer"
                        onMouseEnter={() => setBackgroundImage("/public/explorer.jpg")}
                        onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
                        onClick={() => navigate("/signup")}
                    >
                        Encuentra tu próxima aventura
                    </button>
                </div>
            </div>
        </section>
    );
};




const Home = () => {
    return (
        <>
            <MyNavbar />
            <HeroSection />
            <GuideOrExplorer />
            <Estadisticas />
            <Testimonials />
            <CtaSection />
            <Footer />
        </>
    );
}

export default Home;