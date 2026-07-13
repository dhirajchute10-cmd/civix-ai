import { useState } from "react";
import { createComplaint } from "../services/complaintService";
import { improveComplaint } from "../services/aiService";

import "../css/ReportComplaint.css";

function ReportComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");

  const [improving, setImproving] = useState(false);

  const handleImprove = async () => {
    if (!description.trim()) {
      alert("Please enter the complaint description first.");
      return;
    }

    try {
      setImproving(true);

      const response = await improveComplaint(description);

      console.log("AI Response:", response.data);

      const aiData = response.data.data;

      setDescription(aiData.improvedDescription);
      setCategory(aiData.category);
      setPriority(aiData.priority);
      setDepartment(aiData.department);

      alert("✨ Complaint Improved Successfully!");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "AI improvement failed."
      );

    } finally {
      setImproving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const complaintData = {
        title,
        description,
        category,
        location,
        image: image ? image.name : "",
      };

      const response = await createComplaint(complaintData);

      alert(response.data.message);

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setImage(null);
      setPriority("");
      setDepartment("");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="report-page">
      <div className="report-card">

        <h1>📝 Report Complaint</h1>

        <p>
          Help us improve your city by reporting an issue.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Complaint Title</label>

            <input
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              type="button"
              className="ai-btn"
              onClick={handleImprove}
              disabled={improving}
            >
              {improving
                ? "🤖 Improving..."
                : "✨ Improve with AI"}
            </button>

          </div>

          <div className="input-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option>Road</option>
              <option>Water</option>
              <option>Garbage</option>
              <option>Electricity</option>
              <option>Drainage</option>
              <option>Street Light</option>
              <option>Others</option>
            </select>
          </div>

          {priority && (
            <div className="input-group">
              <label>AI Priority</label>
              <input
                type="text"
                value={priority}
                readOnly
              />
            </div>
          )}

          {department && (
            <div className="input-group">
              <label>Suggested Department</label>
              <input
                type="text"
                value={department}
                readOnly
              />
            </div>
          )}

          <div className="input-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Upload Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
          >
            Submit Complaint
          </button>

        </form>

      </div>
    </div>
  );
}

export default ReportComplaint;