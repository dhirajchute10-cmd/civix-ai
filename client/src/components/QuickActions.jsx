import { useNavigate } from "react-router-dom";

function QuickActions() {

  const navigate = useNavigate();

  return (

    <div className="quick-actions">

      <button
        className="action-btn"
        onClick={() => navigate("/report")}
      >
        📝 Report Complaint
      </button>

      <button
        className="action-btn"
        onClick={() => navigate("/my-complaints")}
      >
        📂 My Complaints
      </button>

      <button
        className="action-btn"
        onClick={() => navigate("/profile")}
      >
        👤 Profile
      </button>

    </div>

  );
}

export default QuickActions;