import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API = `${API_BASE}/api/services`;

export const getAllServices = async () => {
  return await axios.get(API);
};

export const getServiceById = async (id) => {
  return await axios.get(`${API}/${id}`);
};