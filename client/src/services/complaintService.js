import axios from "axios";

const API = "http://localhost:5000/api/complaints";

export const createComplaint = async (formData) => {

    const token = localStorage.getItem("token");

    return await axios.post(API, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

};

export const getMyComplaints = async () => {

    const token = localStorage.getItem("token");

    return await axios.get(`${API}/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

};

export const getComplaintStats = async () => {

    const token = localStorage.getItem("token");

    return await axios.get(`${API}/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

};

export const getComplaintById = async (id) => {

    const token = localStorage.getItem("token");

    return await axios.get(`${API}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

};

export const getRecentComplaints = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(`${API}/recent`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateComplaint = async (id, data) => {

  const token = localStorage.getItem("token");

  return await axios.put(
    `${API}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

};

export const deleteComplaint = async (id) => {

    const token = localStorage.getItem("token");

    return await axios.delete(`${API}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

};