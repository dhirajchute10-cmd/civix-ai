import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API = `${API_BASE}/api/users`;

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProfile = () => {
  return axios.get(`${API}/profile`, getToken());
};

export const updateProfile = (data) => {
  return axios.put(`${API}/profile`, data, getToken());
};

export const changePassword = (data) => {
  return axios.put(`${API}/change-password`, data, getToken());
};