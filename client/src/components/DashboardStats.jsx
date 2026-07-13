import { useEffect, useState } from "react";
import { getComplaintStats } from "../services/complaintService";

function DashboardStats() {
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
      const res = await getComplaintStats();
      setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="stats-grid">

      <div className="stat-card">
        <h2>{stats.total}</h2>
        <p>Total Complaints</p>
      </div>

      <div className="stat-card">
        <h2>{stats.pending}</h2>
        <p>Pending</p>
      </div>

      <div className="stat-card">
        <h2>{stats.inProgress}</h2>
        <p>In Progress</p>
      </div>

      <div className="stat-card">
        <h2>{stats.resolved}</h2>
        <p>Resolved</p>
      </div>

    </div>
  );
}

export default DashboardStats;