import React, { useState } from "react";
import "../styles/HeroSection.css"; 

const HeroSection = () => {
  const [backgroundImage, setBackgroundImage] = useState("/Torres.jpeg");

  return (
    <section 
      className="hero"
      style={{ backgroundImage: `url(${backgroundImage})` }} 
    >
      <div className="hero-content">
        <h1>Gana dinero siendo guía o explora el mundo</h1>
        <p>
        Unete a una comunidad de viajeros apasionados y guías expertos. Comparte tus conocimientos, 
          crea experiencias inolvidables, o encuentra aventuras únicas en todo el mundo.

        </p>
        <div className="hero-buttons">
          <button 
            className="btn btn-ranger"
            onMouseEnter={() => setBackgroundImage("/public/ranger.jpg")} 
            onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
          >
            Conviértete en Ranger
          </button>
          <button 
            className="btn btn-explorer"
            onMouseEnter={() => setBackgroundImage("/public/explorer.jpg")} 
            onMouseLeave={() => setBackgroundImage("/Torres.jpeg")} 
          >
            Ecuentra tu próxima aventura
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;