import axios from "axios";
import { API_BASE } from "./apiBase";

const API = `${API_BASE}/api/services`;

export const getAllServices = async () => {
  return await axios.get(API);
};

export const getServiceById = async (id) => {
  return await axios.get(`${API}/${id}`);
};