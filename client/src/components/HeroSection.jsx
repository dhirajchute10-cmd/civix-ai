import { Link } from "react-router-dom";
import "../css/Hero.css";

function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-overlay">

        <div className="hero-content">

          <h1>Welcome to CIVIX AI</h1>

          <p>
            Smart Citizen Complaint & Government Service Portal
            for faster complaint resolution and easy access
            to government services.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <Link to="/services" className="secondary-btn">
              Explore Services
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;