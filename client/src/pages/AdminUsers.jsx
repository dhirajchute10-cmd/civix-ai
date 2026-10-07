import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../services/authService";
import "../css/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers();

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setError("Unable to load users.");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;

  const totalCitizens = users.filter(
    (user) => user.role === "citizen"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const totalOfficers = users.filter(
    (user) => user.role === "officer"
  ).length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        role.includes(searchValue);

      const matchesRole =
        roleFilter === "all" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRoleLabel = (role) => {
    if (!role) return "Unknown";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="users-loading">
          <div className="users-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="users-error">
          <div className="users-error-icon">⚠️</div>
          <h2>Unable to Load Users</h2>
          <p>{error}</p>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>👥 User Management</h1>
          <p>
            Manage and monitor citizens, administrators and officers
            registered on CIVIX AI.
          </p>
        </div>

        <button className="users-refresh" onClick={fetchUsers}>
          ↻ Refresh
        </button>
      </div>

      <div className="users-stats">
        <div className="user-stat-card blue">
          <div className="user-stat-icon">👥</div>
          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className="user-stat-card green">
          <div className="user-stat-icon">🧑</div>
          <div>
            <span>Citizens</span>
            <strong>{totalCitizens}</strong>
          </div>
        </div>

        <div className="user-stat-card purple">
          <div className="user-stat-icon">🛡️</div>
          <div>
            <span>Admins</span>
            <strong>{totalAdmins}</strong>
          </div>
        </div>

        <div className="user-stat-card orange">
          <div className="user-stat-icon">👨‍💼</div>
          <div>
            <span>Officers</span>
            <strong>{totalOfficers}</strong>
          </div>
        </div>
      </div>

      <div className="users-panel">
        <div className="users-panel-header">
          <div>
            <h2>Registered Users</h2>
            <p>
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>

        <div className="users-toolbar">
          <div className="users-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="users-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
          </select>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-profile">
                        <div className="user-avatar">
                          {getInitials(user.fullName)}
                        </div>

                        <div className="user-details">
                          <strong>{user.fullName || "Unknown User"}</strong>
                          <span>
                            ID: {user._id?.slice(-6) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">
                        {user.email || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`role-badge ${
                          user.role?.toLowerCase() || "unknown"
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    <td>
                      <span className="joined-date">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="users-empty">
                      <div>🔎</div>
                      <h3>No Users Found</h3>
                      <p>
                        Try changing the search text or role filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;