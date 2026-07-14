import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "../pages/Profile";
import ComplaintDetails from "../pages/ComplaintDetails";
import MyComplaints from "../pages/MyComplaints";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ReportComplaint from "../pages/ReportComplaint";
import ProtectedRoute from "./ProtectedRoute";
import AdminComplaints from "../pages/AdminComplaints";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLogin from "../pages/AdminLogin";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <AdminProtectedRoute>
              <AdminComplaints />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;