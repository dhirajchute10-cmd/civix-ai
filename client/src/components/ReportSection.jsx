import { Link } from "react-router-dom";
import "../css/Report.css";

function ReportSection() {
  return (
    <section className="report-section">
      <h2>📢 Report a Complaint</h2>

      <p>
        Report civic issues quickly and track their status online.
      </p>

      <Link to="/report" className="primary-btn">
        Report Now
      </Link>
    </section>
  );
}

export default ReportSection;