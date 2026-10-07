import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/complaintService";
import "../../css/DashboardCards.css";

function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-cards">

      <div className="card total">
        <h3>Total Complaints</h3>
        <h1>{stats.total}</h1>
      </div>

      <div className="card pending">
        <h3>Pending</h3>
        <h1>{stats.pending}</h1>
      </div>

      <div className="card progress">
        <h3>In Progress</h3>
        <h1>{stats.inProgress}</h1>
      </div>

      <div className="card resolved">
        <h3>Resolved</h3>
        <h1>{stats.resolved}</h1>
      </div>

    </div>
  );
}

export default DashboardCards;