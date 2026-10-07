import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllServices } from "../services/serviceService";
import "../css/Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearch(initialSearch);
  }, [searchParams]);

  useEffect(() => {
    loadServices();
  }, []);

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

  const categories = useMemo(() => {
    const values = services
      .map((service) => service.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [services]);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !keyword ||
        `${service.serviceName || ""} ${service.description || ""} ${
          service.category || ""
        }`
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="services-page">
      <Navbar />

      <main>
        <section className="services-hero">
          <div className="services-container">
            <div className="services-breadcrumb">
              Home <span>/</span> Government Services
            </div>

            <div className="services-hero-content">
              <div>
                <span className="services-kicker">
                  Citizen services
                </span>

                <h1>Government Services</h1>

                <p>
                  Find information about available government services,
                  required documents, application process and other useful
                  details.
                </p>
              </div>

              <div className="services-count-box">
                <strong>{services.length}</strong>
                <span>Services available</span>
              </div>
            </div>

            <div className="services-search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search for a government service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}

              <button
                type="button"
                onClick={() => setSearch(search)}
                className="services-search-button"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="services-main">
          <div className="services-container">
            <div className="services-layout">
              <aside className="services-sidebar">
                <div className="sidebar-heading">
                  <span>Browse by</span>
                  <strong>Category</strong>
                </div>

                <div className="category-list">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        category === item
                          ? "category-button active"
                          : "category-button"
                      }
                      onClick={() => setCategory(item)}
                    >
                      <span>{item}</span>
                      <small>
                        {
                          services.filter(
                            (service) =>
                              item === "All" ||
                              service.category === item
                          ).length
                        }
                      </small>
                    </button>
                  ))}
                </div>
              </aside>

              <div className="services-content">
                <div className="services-content-top">
                  <div>
                    <span className="services-kicker">
                      Available services
                    </span>

                    <h2>
                      {search
                        ? `Search results for "${search}"`
                        : category === "All"
                        ? "All Government Services"
                        : category}
                    </h2>
                  </div>

                  <span className="result-count">
                    {filteredServices.length} result
                    {filteredServices.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {loading ? (
                  <div className="services-message">
                    <div className="loading-line" />
                    <p>Loading services...</p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="services-message empty">
                    <div className="empty-icon">
                      <FaSearch />
                    </div>

                    <h3>No service found</h3>

                    <p>
                      Try another service name or select a different
                      category.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                    >
                      View all services
                    </button>
                  </div>
                ) : (
                  <div className="services-grid">
                    {filteredServices.map((service) => (
                      <article
                        key={service._id}
                        className="service-card"
                        onClick={() =>
                          navigate(`/services/${service._id}`)
                        }
                      >
                        <div className="service-card-top">
                          <div className="service-icon">
                            {service.icon || "▣"}
                          </div>

                          <span className="service-category">
                            {service.category || "Citizen Service"}
                          </span>
                        </div>

                        <h3>{service.serviceName}</h3>

                        <p>
                          {service.description ||
                            "View service information, documents and application process."}
                        </p>

                        <div className="service-card-footer">
                          <span>View service details</span>
                          <FaArrowRight />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="services-help">
          <div className="services-container">
            <div>
              <span className="services-kicker">
                Need assistance?
              </span>

              <h2>Not sure which service you need?</h2>

              <p>
                Use the CIVIX AI assistant for guidance or contact the
                appropriate authority for official information.
              </p>
            </div>

            <div className="services-help-note">
              CIVIX AI provides assistance and does not replace official
              government authorities.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Services;