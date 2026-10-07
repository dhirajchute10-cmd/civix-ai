import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaClock, FaFileAlt, FaMoneyBillWave, FaUserCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getServiceById } from "../services/serviceService";
import "../css/ServiceDetails.css";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const res = await getServiceById(id);
      setService(res.data?.service || null);
    } catch (error) {
      console.error("Error loading service:", error);
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="service-details-page">
        <Navbar />

        <div className="service-details-loading">
          <div className="details-loading-line" />
          <p>Loading service information...</p>
        </div>

        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-details-page">
        <Navbar />

        <div className="service-not-found">
          <h2>Service not found</h2>

          <p>
            The requested service could not be found.
          </p>

          <button onClick={() => navigate("/services")}>
            <FaArrowLeft />
            Back to Services
          </button>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="service-details-page">
      <Navbar />

      <main>
        <section className="details-header">
          <div className="details-container">
            <div className="details-breadcrumb">
              <button onClick={() => navigate("/services")}>
                Government Services
              </button>

              <span>/</span>

              <span>{service.serviceName}</span>
            </div>

            <button
              className="back-services-button"
              onClick={() => navigate("/services")}
            >
              <FaArrowLeft />
              Back to Services
            </button>

            <div className="details-title-area">
              <div className="details-main-icon">
                {service.icon || "▣"}
              </div>

              <div>
                <span className="details-kicker">
                  {service.category || "Citizen Service"}
                </span>

                <h1>{service.serviceName}</h1>

                <p>
                  {service.description ||
                    "Information about this government service."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="details-main">
          <div className="details-container">
            <div className="details-grid">
              <div className="details-primary">
                <section className="details-card">
                  <div className="details-section-title">
                    <span>
                      <FaFileAlt />
                    </span>

                    <div>
                      <small>What you need</small>
                      <h2>Required Documents</h2>
                    </div>
                  </div>

                  {service.documents?.length > 0 ? (
                    <div className="documents-list">
                      {service.documents.map((doc, index) => (
                        <div
                          className="document-item"
                          key={index}
                        >
                          <FaCheckCircle />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="details-muted">
                      Document information is not currently available.
                      Please verify the latest requirements with the
                      appropriate authority.
                    </p>
                  )}
                </section>

                <section className="details-card">
                  <div className="details-section-title">
                    <span>
                      <FaUserCheck />
                    </span>

                    <div>
                      <small>Who can use it</small>
                      <h2>Eligibility</h2>
                    </div>
                  </div>

                  <p className="eligibility-text">
                    {service.eligibility ||
                      "Please check the official government guidelines for the latest eligibility requirements."}
                  </p>
                </section>

                <section className="details-card">
                  <div className="details-section-title">
                    <span>
                      <FaArrowRight />
                    </span>

                    <div>
                      <small>Application procedure</small>
                      <h2>How to Apply</h2>
                    </div>
                  </div>

                  {service.process?.length > 0 ? (
                    <div className="application-steps">
                      {service.process.map((step, index) => (
                        <div
                          className="application-step"
                          key={index}
                        >
                          <div className="step-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="step-content">
                            <strong>{step}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="details-muted">
                      The application process is not currently available.
                      Please check the relevant official government portal.
                    </p>
                  )}
                </section>
              </div>

              <aside className="details-sidebar">
                <div className="service-summary-card">
                  <div className="summary-heading">
                    <span>Service information</span>
                  </div>

                  <div className="summary-item">
                    <span className="summary-icon">
                      <FaClock />
                    </span>

                    <div>
                      <small>Processing time</small>

                      <strong>
                        {service.processingTime ||
                          "Please verify officially"}
                      </strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span className="summary-icon">
                      <FaMoneyBillWave />
                    </span>

                    <div>
                      <small>Fees</small>

                      <strong>
                        {service.fees ||
                          "Please verify officially"}
                      </strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span className="summary-icon">
                      <FaFileAlt />
                    </span>

                    <div>
                      <small>Category</small>

                      <strong>
                        {service.category || "Citizen Service"}
                      </strong>
                    </div>
                  </div>

                  {service.applyLink && (
                    <a
                      href={service.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="apply-button"
                    >
                      Apply Online
                      <FaArrowRight />
                    </a>
                  )}

                  <p className="official-note">
                    Application links and service information should be
                    verified with the relevant official authority before
                    submission.
                  </p>
                </div>

                <div className="details-help-card">
                  <span className="details-kicker">
                    Need assistance?
                  </span>

                  <h3>Use CIVIX AI</h3>

                  <p>
                    Get guidance about civic complaints and available
                    government services.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ServiceDetails;