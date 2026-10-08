import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../services/apiBase";

import {
  getComplaintById,
  updateComplaintStatus,
  adminDeleteComplaint,
} from "../services/complaintService";

import "../css/AdminComplaintDetails.css";

function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);

      const res = await getComplaintById(id);
      const data = res.data.complaint;

      setComplaint(data);
      setStatus(data.status || "Pending");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to load complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async () => {
    if (!status) return;

    try {
      setUpdating(true);

      await updateComplaintStatus(id, status);

      alert("Complaint status updated successfully.");

      await fetchComplaint();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update complaint status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await adminDeleteComplaint(id);

      alert("Complaint deleted successfully.");

      navigate("/admin/complaints");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete complaint."
      );
    }
  };

  const getStatusClass = (currentStatus) => {
    if (currentStatus === "Resolved") return "status-resolved";
    if (currentStatus === "In Progress") return "status-progress";
    return "status-pending";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Road: "🛣️",
      Water: "💧",
      Electricity: "⚡",
      Garbage: "🗑️",
      Drainage: "🚰",
      "Street Light": "💡",
      Others: "📌",
    };

    return icons[category] || "📌";
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  if (loading) {
    return (
      <div className="admin-detail-loading">
        <div className="admin-detail-spinner"></div>
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="admin-detail-page">
        <div className="admin-detail-empty">
          <div>📄</div>
          <h2>Complaint not found</h2>
          <p>The complaint could not be loaded.</p>
          <button onClick={() => navigate("/admin/complaints")}>
            ← Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-container">

        <div className="admin-detail-topbar">
          <button
            className="back-button"
            onClick={() => navigate("/admin/complaints")}
          >
            ← Back to Complaints
          </button>

          <span className="complaint-id">
            Complaint ID: {id.slice(-8).toUpperCase()}
          </span>
        </div>

        <div className="admin-detail-header">
          <div className="header-main">
            <div className="category-icon">
              {getCategoryIcon(complaint.category)}
            </div>

            <div>
              <div className="header-category">
                {complaint.category || "Other"}
              </div>

              <h1>{complaint.title}</h1>

              <p>
                Submitted{" "}
                {complaint.createdAt
                  ? new Date(complaint.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <span
            className={`status-badge ${getStatusClass(
              complaint.status
            )}`}
          >
            <span className="status-dot"></span>
            {complaint.status || "Pending"}
          </span>
        </div>

        <div className="admin-detail-grid">

          <div className="admin-detail-main">

            <section className="detail-section">
              <div className="section-heading">
                <span>📝</span>
                <div>
                  <h2>Complaint Description</h2>
                  <p>Details provided by the citizen</p>
                </div>
              </div>

              <div className="description-box">
                {complaint.description || "No description provided."}
              </div>
            </section>

            <section className="detail-section">
              <div className="section-heading">
                <span>📍</span>
                <div>
                  <h2>Location</h2>
                  <p>Reported complaint location</p>
                </div>
              </div>

              <div className="location-box">
                <div className="location-icon">📍</div>

                <div>
                  <strong>Reported Location</strong>
                  <p>
                    {complaint.location || "Location not available"}
                  </p>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <div className="section-heading">
                <span>📷</span>
                <div>
                  <h2>Complaint Evidence</h2>
                  <p>Image submitted with the complaint</p>
                </div>
              </div>

              {complaint.image ? (
                <div className="evidence-box">
                  <img
                    src={getImageUrl(complaint.image)}
                    alt="Complaint evidence"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />

                  <div className="evidence-error">
                    <span>🖼️</span>
                    <strong>Unable to display the image</strong>
                    <p>The uploaded image could not be loaded.</p>
                  </div>
                </div>
              ) : (
                <div className="no-evidence">
                  <span>📷</span>
                  <strong>No image uploaded</strong>
                  <p>This complaint does not contain image evidence.</p>
                </div>
              )}
            </section>

            <section className="detail-section">
              <div className="section-heading">
                <span>📍</span>
                <div>
                  <h2>Complaint Tracking</h2>
                  <p>Status history of this complaint</p>
                </div>
              </div>

              {complaint.tracking &&
              complaint.tracking.length > 0 ? (
                <div className="timeline">
                  {complaint.tracking.map((item, index) => (
                    <div
                      className="timeline-item"
                      key={index}
                    >
                      <div className="timeline-marker"></div>

                      <div className="timeline-content">
                        <div className="timeline-top">
                          <strong>{item.status}</strong>

                          <span>
                            {item.updatedAt
                              ? new Date(
                                  item.updatedAt
                                ).toLocaleString()
                              : ""}
                          </span>
                        </div>

                        <p>
                          {item.message ||
                            "Complaint status updated."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-tracking">
                  No tracking history available.
                </div>
              )}
            </section>

          </div>

          <aside className="admin-detail-sidebar">

            <section className="detail-section citizen-section">
              <div className="section-heading">
                <span>👤</span>
                <div>
                  <h2>Citizen Information</h2>
                  <p>Complaint submitted by</p>
                </div>
              </div>

              <div className="citizen-profile">
                <div className="citizen-avatar">
                  {complaint.citizen?.fullName
                    ? complaint.citizen.fullName
                        .charAt(0)
                        .toUpperCase()
                    : "C"}
                </div>

                <div>
                  <strong>
                    {complaint.citizen?.fullName ||
                      "Unknown Citizen"}
                  </strong>

                  <span>
                    {complaint.citizen?.email ||
                      "Email not available"}
                  </span>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <div className="section-heading">
                <span>📋</span>
                <div>
                  <h2>Complaint Information</h2>
                  <p>Additional case details</p>
                </div>
              </div>

              <div className="info-list">
                <div className="info-row">
                  <span>Category</span>
                  <strong>
                    {complaint.category || "N/A"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Priority</span>
                  <strong>
                    {complaint.priority || "N/A"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Department</span>
                  <strong>
                    {complaint.department || "N/A"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Submitted</span>
                  <strong>
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="detail-section action-section">
              <div className="section-heading">
                <span>⚙️</span>
                <div>
                  <h2>Admin Actions</h2>
                  <p>Manage this complaint</p>
                </div>
              </div>

              <label className="status-label">
                Update Complaint Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="status-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button
                className="update-status-button"
                onClick={handleStatus}
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Update Status"}
              </button>

              <button
                className="delete-complaint-button"
                onClick={handleDelete}
              >
                🗑 Delete Complaint
              </button>
            </section>

          </aside>
        </div>

      </div>
    </div>
  );
}

export default AdminComplaintDetails;