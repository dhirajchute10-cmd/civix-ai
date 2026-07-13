import { useEffect, useState } from "react";
import { getMyComplaints } from "../services/complaintService";
import ComplaintCard from "../components/ComplaintCard";

import "../css/MyComplaints.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getMyComplaints();
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mycomplaints-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="mycomplaints-page">
      <div className="mycomplaints-card">

        <h1>📋 My Complaints</h1>

        {complaints.length === 0 ? (
          <h3>No complaints found.</h3>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
            />
          ))
        )}

      </div>
    </div>
  );
}

export default MyComplaints;