
import "../css/ComplaintCard.css";
import { useNavigate } from "react-router-dom";

function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

  return (
    <div
      className="complaint-card"
      onClick={() => navigate(`/complaint/${complaint._id}`)}
    >
      <h3>{complaint.title}</h3>

      <p>
        <strong>Category:</strong> {complaint.category}
      </p>

      <p>
        <strong>Location:</strong> {complaint.location}
      </p>

      <p>
        <strong>Status:</strong> {complaint.status}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(complaint.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ComplaintCard;