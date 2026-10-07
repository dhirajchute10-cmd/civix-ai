import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronDown,
  FaFileAlt,
  FaMapMarkerAlt,
  FaRobot,
  FaSearch,
  FaShieldAlt,
  FaSignInAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllServices } from "../services/serviceService";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await getAllServices();
        setServices(res.data?.services || []);
      } catch (error) {
        console.error("Unable to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return services;

    return services.filter((service) =>
      `${service.serviceName || ""} ${service.category || ""}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [search, services]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (search.trim()) {
      navigate(`/services?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-notice">
        <div className="home-container notice-inner">
          <span className="notice-label">CIVIX AI</span>

          <span>
            Ward-level citizen support for civic complaints and government
            services
          </span>

          <Link to="/services">
            View services <FaArrowRight />
          </Link>
        </div>
      </div>

      <main>
        <section className="home-hero">
          <div className="home-container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <FaShieldAlt />
                Citizen Services Portal
              </div>

              <h1>One place for your civic needs.</h1>

              <p>
                Report local civic issues, track complaints, and find
                government service information through one simple citizen
                portal.
              </p>

              <form className="hero-search" onSubmit={handleSearch}>
                <FaSearch className="hero-search-icon" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search government services"
                  aria-label="Search government services"
                />

                <button type="submit">Search</button>
              </form>

              <div className="hero-links">
                <Link to="/register" className="hero-primary">
                  Report a Complaint
                  <FaArrowRight />
                </Link>

                <Link to="/services" className="hero-secondary">
                  Browse Services
                </Link>
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-topline">
                <span>Quick access</span>

                <span className="panel-status">
                  <span />
                  Available
                </span>
              </div>

              <Link
                to="/register"
                className="quick-card quick-card-main"
              >
                <span className="quick-icon">
                  <FaFileAlt />
                </span>

                <span>
                  <strong>Report a civic complaint</strong>
                  <small>
                    Road, water, garbage, drainage and more
                  </small>
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/services" className="quick-card">
                <span className="quick-icon">
                  <FaFileAlt />
                </span>

                <span>
                  <strong>Find a government service</strong>
                  <small>
                    Documents, process and service details
                  </small>
                </span>

                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-block access-section">
          <div className="home-container">
            <div className="section-heading compact-heading">
              <div>
                <span className="section-kicker">Quick access</span>

                <h2>Services citizens use most</h2>

                <p>
                  Start with the service or action you need.
                </p>
              </div>

              <Link to="/services" className="view-all-link">
                View all services <FaArrowRight />
              </Link>
            </div>

            <div className="access-grid">
              <Link to="/register" className="access-card">
                <span className="access-card-icon">
                  <FaFileAlt />
                </span>

                <span>
                  <strong>Report Complaint</strong>
                  <small>Submit a civic issue online</small>
                </span>

                <FaArrowRight />
              </Link>

              <Link to="/services" className="access-card">
                <span className="access-card-icon">
                  <FaFileAlt />
                </span>

                <span>
                  <strong>Government Services</strong>
                  <small>Explore available services</small>
                </span>

                <FaArrowRight />
              </Link>

              <div className="access-card ai-access-card">
                <span className="access-card-icon">
                  <FaRobot />
                </span>

                <span>
                  <strong>CIVIX AI Assistant</strong>
                  <small>Get instant citizen guidance</small>
                </span>

                <span className="ai-tag">AI</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block services-section">
          <div className="home-container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  Government services
                </span>

                <h2>Popular services</h2>

                <p>
                  Access service information, required documents and
                  application guidance.
                </p>
              </div>

              <Link
                to="/services"
                className="outline-link"
              >
                Explore all <FaArrowRight />
              </Link>
            </div>

            {search.trim() && (
              <div className="search-result-note">
                Showing services related to “{search}”
              </div>
            )}

            <div className="service-list">
              {loading ? (
                <div className="service-empty">
                  Loading services...
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="service-empty">
                  No matching service found.{" "}
                  <Link to="/services">
                    Browse all services
                  </Link>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <button
                    key={service._id}
                    type="button"
                    className="government-service-row"
                    onClick={() =>
                      navigate(`/services/${service._id}`)
                    }
                  >
                    <span className="service-row-icon">
                      {service.icon || "▣"}
                    </span>

                    <span className="service-row-content">
                      <strong>{service.serviceName}</strong>

                      <small>
                        {service.category || "Citizen Service"}
                      </small>
                    </span>

                    <span className="service-row-arrow">
                      <FaChevronDown />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="service-info-strip">
          <div className="home-container info-grid">
            <div>
              <span className="info-icon">
                <FaFileAlt />
              </span>

              <div>
                <strong>Clear service information</strong>

                <p>
                  See documents, process and available details.
                </p>
              </div>
            </div>

            <div>
              <span className="info-icon">
                <FaMapMarkerAlt />
              </span>

              <div>
                <strong>Location-based complaints</strong>

                <p>
                  Add the issue location while reporting.
                </p>
              </div>
            </div>

            <div>
              <span className="info-icon">
                <FaRobot />
              </span>

              <div>
                <strong>AI assistance</strong>

                <p>
                  Get guidance while using the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block how-section">
          <div className="home-container how-grid">
            <div>
              <span className="section-kicker">
                Simple process
              </span>

              <h2>Report. Track. Resolve.</h2>

              <p>
                CIVIX keeps the complaint journey simple for
                citizens and provides a clear place to follow
                progress.
              </p>

              <Link
                to="/register"
                className="dark-action"
              >
                Create citizen account
                <FaArrowRight />
              </Link>
            </div>

            <div className="steps-list">
              <div className="step-item">
                <span>01</span>

                <div>
                  <strong>Report</strong>

                  <p>
                    Describe the civic issue and add its location.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <span>02</span>

                <div>
                  <strong>Submit</strong>

                  <p>
                    Add image evidence when useful and submit.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <span>03</span>

                <div>
                  <strong>Track</strong>

                  <p>
                    Open My Complaints to view the current status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-about" id="about">
          <div className="home-container about-grid">
            <div>
              <span className="section-kicker">
                About CIVIX AI
              </span>

              <h2>Designed around the citizen.</h2>
            </div>

            <p>
              CIVIX AI is a ward-level academic platform for
              intelligent urban governance. It brings civic
              complaint reporting, complaint tracking,
              government-service information and AI-based
              assistance into one place.
            </p>
          </div>
        </section>

        <section className="home-contact" id="contact">
          <div className="home-container contact-card">
            <div>
              <span className="section-kicker">
                Need help?
              </span>

              <h2>Sign in to use citizen services.</h2>

              <p>
                Use your citizen account to report and track
                complaints.
              </p>
            </div>

            <div className="contact-actions">
              <Link
                to="/login"
                className="dark-action"
              >
                <FaSignInAlt />
                Citizen Login
              </Link>

              <Link
                to="/register"
                className="light-action"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;