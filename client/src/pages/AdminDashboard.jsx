import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import DashboardCards from "../components/admin/DashboardCards";
import RecentComplaints from "../components/admin/RecentComplaints";

function AdminDashboard() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f5f5f5",
        }}
      >
        <AdminNavbar />

        <br />

        <DashboardCards />

        <br />

        <RecentComplaints />
      </div>
    </div>
  );
}

export default AdminDashboard;