import { useEffect, useState } from "react";
import { getAllComplaints } from "../../services/complaintService";

function RecentComplaints() {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await getAllComplaints();

      setComplaints(res.data.complaints.slice(0, 5));

    } catch (err) {
      console.log(err);
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

          {complaints.map((item) => (

            <tr key={item._id}>

              <td>{item.citizen?.fullName}</td>

              <td>{item.category}</td>

              <td>{item.status}</td>

              <td>{item.priority || "N/A"}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentComplaints;