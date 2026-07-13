import "../css/Hero.css";
import Button from "./Button";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <h1>🚀 AI Powered Smart Citizen Platform</h1>

        <p>
          Making Urban Governance Smarter with Artificial Intelligence.
        </p>

        <div className="hero-buttons">
          <Button
            text="📢 Report Complaint"
            type="primary"
          />

          <Button
            text="📍 Track Complaint"
            type="secondary"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;