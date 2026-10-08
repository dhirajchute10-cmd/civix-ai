import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API = `${API_BASE}/api/ai`;

export const improveComplaint = async (description) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    `${API}/improve`,
    { description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};