import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/complaintService";

function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAdminStats();

      setStats(response.data.stats);
    } catch (error) {
      console.log(error);
      alert("Failed to load admin statistics.");
    }
  };

  return (
    <div className="dashboard-cards">

      <div className="card">
        <h3>Total Complaints</h3>
        <h1>{stats.total}</h1>
      </div>

      <div className="card">
        <h3>Pending</h3>
        <h1>{stats.pending}</h1>
      </div>

      <div className="card">
        <h3>In Progress</h3>
        <h1>{stats.inProgress}</h1>
      </div>

      <div className="card">
        <h3>Resolved</h3>
        <h1>{stats.resolved}</h1>
      </div>

    </div>
  );
}

export default DashboardCards;