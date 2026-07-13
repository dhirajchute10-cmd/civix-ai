import { useNavigate } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import QuickActions from "../components/QuickActions";
import RecentComplaints from "../components/RecentComplaints";

import "../css/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>🏛️ CIVIX AI Dashboard</h1>

          <p>
            Welcome back,
            <strong> {user?.fullName}</strong>
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <DashboardStats />

      <QuickActions />

      <RecentComplaints />

    </div>

  );

}

export default Dashboard;