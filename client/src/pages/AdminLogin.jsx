import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminLogin } from "../services/authService";
import "../css/Login.css";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await adminLogin({
        email,
        password,
      });

      const user = response.data?.user;
      const token = response.data?.token;

      if (!user || user.role !== "admin") {
        alert("Access Denied! Admin account required.");
        return;
      }

      if (!token) {
        alert("Login failed. Authentication token not received.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Welcome Admin!");

      const redirectPath = location.state?.from || "/admin";

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Admin Login Error:", error);

      alert(
        error.response?.data?.message ||
          "Admin Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>CIVIX AI</h1>

        <h2>Admin Portal</h2>

        <p>
          Only authorized administrators can log in.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;