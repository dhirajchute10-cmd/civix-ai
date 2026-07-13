import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "../services/complaintService";

import "../css/ComplaintDetails.css";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintById(id);

      setComplaint(res.data.complaint);

      setFormData({
        title: res.data.complaint.title,
        description: res.data.complaint.description,
        category: res.data.complaint.category,
        location: res.data.complaint.location,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load complaint.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await updateComplaint(id, formData);

      alert("Complaint Updated Successfully");

      setEditing(false);

      fetchComplaint();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);

      alert("Complaint Deleted Successfully");

      navigate("/my-complaints");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  if (!complaint) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="details-page">
      <div className="details-card">

        {editing ? (
          <>
            <h1>Edit Complaint</h1>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <br /><br />

            <textarea
              name="description"
              rows="5"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <br /><br />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Road</option>
              <option>Water</option>
              <option>Electricity</option>
              <option>Garbage</option>
              <option>Drainage</option>
              <option>Street Light</option>
              <option>Others</option>
            </select>

            <br /><br />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <br /><br />

            <button onClick={handleUpdate}>
              💾 Save Changes
            </button>

            <button
              onClick={() => setEditing(false)}
              style={{ marginLeft: "10px" }}
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <h1>{complaint.title}</h1>

            <p>
              <strong>Status :</strong> {complaint.status}
            </p>

            <p>
              <strong>Category :</strong> {complaint.category}
            </p>

            <p>
              <strong>Location :</strong> {complaint.location}
            </p>

            <p>
              <strong>Description :</strong> {complaint.description}
            </p>

            <p>
              <strong>Created :</strong>{" "}
              {new Date(
                complaint.createdAt
              ).toLocaleString()}
            </p>

            {complaint.status === "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button onClick={() => setEditing(true)}>
                  ✏️ Edit Complaint
                </button>

                <button
                  onClick={handleDelete}
                  style={{
                    background: "#dc2626",
                    color: "white",
                  }}
                >
                  🗑 Delete Complaint
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/my-complaints")}
              style={{
                marginTop: "20px",
              }}
            >
              ⬅ Back
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ComplaintDetails;