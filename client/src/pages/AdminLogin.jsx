import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../css/Login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      });

      // Check admin role
      if (response.data.user.role !== "admin") {
        alert("Access Denied! Admin account required.");
        return;
      }

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Welcome Admin!");

      navigate("/admin");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>🛡️ CIVIX AI</h1>

        <h2>Admin Portal</h2>

        <p>Only authorized administrators can log in.</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Admin Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;