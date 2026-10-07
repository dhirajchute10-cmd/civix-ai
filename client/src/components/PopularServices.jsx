import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllServices } from "../services/serviceService";
import "../css/PopularServices.css";

function PopularServices() {

  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await getAllServices();
      setServices(res.data.services.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="popular-services">

      <h2>⭐ Popular Government Services</h2>

      <p>Most frequently used citizen services</p>

      <div className="services-grid">

        {services.length === 0 ? (

          <h3>No Services Available</h3>

        ) : (

          services.map((service) => (

            <div
              key={service._id}
              className="service-card"
              onClick={() => navigate(`/services/${service._id}`)}
            >

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.serviceName}</h3>

              <p>{service.category}</p>

            </div>

          ))

        )}

      </div>

    </section>
  );
}

export default PopularServices;