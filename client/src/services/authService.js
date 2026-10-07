import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

export const adminLogin = (data) => {
  return axios.post(`${API}/admin-login`, data);
};

export const getAllUsers = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};