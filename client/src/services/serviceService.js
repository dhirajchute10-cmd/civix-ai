import axios from "axios";

const API = "http://localhost:5000/api/services";

export const getAllServices = async () => {
  return await axios.get(API);
};

export const getServiceById = async (id) => {
  return await axios.get(`${API}/${id}`);
};