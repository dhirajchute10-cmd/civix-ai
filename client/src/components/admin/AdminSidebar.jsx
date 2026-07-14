
import "../../css/AdminSidebar.css";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">

      <h2>CIVIX AI</h2>

      <Link to="/admin">🏠 Dashboard</Link>

      <Link to="/admin/complaints">📋 Complaints</Link>

      <Link to="/admin/users">👥 Users</Link>

      <Link to="/admin/analytics">📊 Analytics</Link>

      <Link to="/">🚪 Logout</Link>

    </div>
  );
}

export default AdminSidebar;