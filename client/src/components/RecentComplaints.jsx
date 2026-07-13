import { useEffect, useState } from "react";
import { getRecentComplaints } from "../services/complaintService";

function RecentComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getRecentComplaints();
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recent-box">
      <h2>Recent Complaints</h2>

      {complaints.length === 0 ? (
        <div className="empty">
          No complaints submitted yet.
        </div>
      ) : (
        complaints.map((complaint) => (
          <div
            key={complaint._id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{complaint.title}</strong>

            <br />

            <small>
              {complaint.category} • {complaint.status}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentComplaints;