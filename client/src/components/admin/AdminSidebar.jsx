import { NavLink, useNavigate } from "react-router-dom";
import "../../css/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="admin-sidebar">

      <h2>CIVIX AI</h2>

      <NavLink to="/admin">
        🏠 Dashboard
      </NavLink>

      <NavLink to="/admin/complaints">
        📋 Complaints
      </NavLink>

      <NavLink to="/admin/users">
        👥 Users
      </NavLink>

      <NavLink to="/admin/analytics">
        📊 Analytics
      </NavLink>

      <button
        onClick={handleLogout}
        className="logout-btn"
      >
        🚪 Logout
      </button>

    </div>
  );
}

export default AdminSidebar;