import React from "react";
import "../styles/AboutUs.css";
import AboutFeatures from "../components/AboutFeatures";
import MyNavbar from "../components/Navbar.jsx";
import PartnersSection from "../components/PartnersSection";
import NewsSection from "../components/NewsSection.jsx";
import CtaSection from "../components/CtaSection.jsx";
import Footer from "../components/Footer.jsx";

const AboutUs = () => {
    return (
        <>
            <MyNavbar />
            <div className="row" id="aboutUs-container">
                <div className="col-12 text-center">
                    <br />
                    <br />
                    <br />
                    <br />
                    <h1>Conectámos el Mundo a Través de la Aventura <br />como Ranger o Explorer</h1>
                    <br />
                    <h5>
                        ¡No nacimos para quedarnos quietos!<br />
                        La verdadera magia ocurre cuando exploramos, cuando nos atrevemos a descubrir lo desconocido. En The Ranger Hub, rompemos las barreras entre guías apasionados y viajeros intrépidos, creando una red global de experiencias inolvidables. Cada rincón del mundo cobra vida a través de quienes lo conocen mejor.”
                    </h5>
                </div>
                <AboutFeatures />
                <PartnersSection />
                <NewsSection />
            </div>
            <CtaSection />
            <Footer />
        </>
    );
};

export default AboutUs;
