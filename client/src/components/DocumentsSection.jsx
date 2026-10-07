import { useEffect, useState } from "react";
import "../css/Documents.css";
import { getAllServices } from "../services/serviceService";

function DocumentsSection() {

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await getAllServices();

      setServices(res.data.services);

      // Do NOT select any service initially
      setSelectedService(null);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <section className="documents">

      <h2>📄 Required Documents Finder</h2>

      <p>
        Select any government service to view its required documents.
      </p>

      <select
        value={selectedService?._id || ""}
        onChange={(e) => {

          const service = services.find(
            (s) => s._id === e.target.value
          );

          setSelectedService(service || null);

        }}
      >

        <option value="">
          Select a Government Service
        </option>

        {services.map((service) => (

          <option
            key={service._id}
            value={service._id}
          >
            {service.serviceName}
          </option>

        ))}

      </select>

      {selectedService && (

        <div className="document-list">

          {selectedService.documents.map((doc, index) => (

            <p key={index}>
              ✅ {doc}
            </p>

          ))}

        </div>

      )}

    </section>

  );
}

export default DocumentsSection;