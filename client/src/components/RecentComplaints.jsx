import "../css/RecentComplaints.css";
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
      console.log(res.data.complaints);
      setComplaints(res.data.complaints);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="recent-complaints">

      <h2>📋 Recent Complaints</h2>

      <table>

        <thead>
          <tr>
            <th>Citizen</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>

          {complaints.map((complaint) => (

            <tr key={complaint._id}>

              <td>{complaint.citizen?.fullName}</td>

              <td>{complaint.category}</td>

              <td>
                <span
                  className={
                    complaint.status === "Resolved"
                      ? "resolved"
                      : complaint.status === "Pending"
                      ? "pending"
                      : "progress"
                  }
                >
                  {complaint.status}
                </span>
              </td>

              <td>{complaint.priority || "N/A"}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentComplaints;