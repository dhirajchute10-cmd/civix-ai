import { Link } from "react-router-dom";
import "../css/Home.css";

function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-container footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            CIVIX <span>AI</span>
          </Link>

          <p>
            AI-powered citizen support for intelligent urban
            governance.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>

          <Link to="/services">
            Services
          </Link>

          <Link to="/login">
            Citizen Login
          </Link>

          <Link to="/admin-login">
            Admin Portal
          </Link>
        </div>
      </div>

      <div className="home-container footer-bottom">
        <span>
          © 2026 CIVIX AI · Academic Project
        </span>

        <span>
          Nagpur, Maharashtra
        </span>
      </div>
    </footer>
  );
}

export default Footer;