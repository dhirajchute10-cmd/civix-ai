import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    user = null;
  }

  const isLoggedIn = !!token && !!user;

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeMobile();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="gov-topbar">
        <div className="nav-container gov-topbar-inner">
          <span>Citizen Services Portal</span>

          <span>
            Ward-level urban governance platform
          </span>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-container navbar-inner">
          <Link
            to="/"
            className="brand"
            onClick={closeMobile}
          >
            <span className="brand-mark">C</span>

            <span className="brand-text">
              <strong>CIVIX</strong>
              <small>CIVIX AI • Citizen Services</small>
            </span>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div
            className={`nav-menu ${
              mobileOpen ? "open" : ""
            }`}
          >
            <Link to="/" onClick={closeMobile}>
              Home
            </Link>

            <Link to="/services" onClick={closeMobile}>
              Services
            </Link>

            <a href="/#about" onClick={closeMobile}>
              About
            </a>

            <a href="/#contact" onClick={closeMobile}>
              Contact
            </a>

            {isLoggedIn ? (
              <button
                className="nav-login"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="nav-login"
                onClick={() => {
                  setShowLoginModal(true);
                  closeMobile();
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <div
          className="login-modal-overlay"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowLoginModal(false)}
            >
              <FaTimes />
            </button>

            <span className="modal-mark">C</span>

            <h2>Sign in to CIVIX</h2>

            <p>
              Select the portal you want to access.
            </p>

            <button
              className="modal-primary"
              onClick={() => {
                setShowLoginModal(false);
                navigate("/login");
              }}
            >
              Citizen Login
            </button>

            <button
              className="modal-secondary"
              onClick={() => {
                setShowLoginModal(false);
                navigate("/admin-login");
              }}
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;