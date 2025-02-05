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
        <h1>Earn money as a guide or explore the world</h1>
        <p>
          Join a community of passionate travelers and expert guides. Share your knowledge, 
          create unforgettable experiences, or find unique adventures worldwide.
        </p>
        <div className="hero-buttons">
          <button 
            className="btn btn-ranger"
            onMouseEnter={() => setBackgroundImage("/public/ranger.jpg")} 
            onMouseLeave={() => setBackgroundImage("/Torres.jpeg")}
          >
            Become a Ranger
          </button>
          <button 
            className="btn btn-explorer"
            onMouseEnter={() => setBackgroundImage("/public/explorer.jpg")} 
            onMouseLeave={() => setBackgroundImage("/Torres.jpeg")} 
          >
            Find Your Next Adventure
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;