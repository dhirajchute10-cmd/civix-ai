import axios from "axios";

const API = "http://localhost:5000/api/users";

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