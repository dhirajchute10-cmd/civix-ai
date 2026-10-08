import axios from "axios";
import { API_BASE } from "./apiBase";

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