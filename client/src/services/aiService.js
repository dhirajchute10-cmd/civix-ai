import axios from "axios";

const API = "http://localhost:5000/api/ai";

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