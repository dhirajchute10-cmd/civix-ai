import axios from "axios";

const API = "http://localhost:5000/api/image";

export const analyzeImage = async (image) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", image);

  return await axios.post(`${API}/analyze`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};