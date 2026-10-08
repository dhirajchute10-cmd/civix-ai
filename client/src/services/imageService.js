import axios from "axios";

// =========================================================
// CIVIX IMAGE API
// =========================================================

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API = `${API_BASE}/api/image`;

// =========================================================
// ANALYZE IMAGE
// =========================================================

export const analyzeImage = async (image) => {
  try {
    // Get logged-in citizen token
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Please login before analyzing an image."
      );
    }

    // Check image
    if (!image) {
      throw new Error(
        "No image was selected."
      );
    }

    // =====================================================
    // CREATE FORM DATA
    // =====================================================

    const formData = new FormData();

    formData.append("image", image);

    // =====================================================
    // SEND IMAGE TO BACKEND
    // =====================================================

    const response = await axios.post(
      `${API}/analyze`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // =====================================================
    // RETURN BACKEND RESPONSE
    // =====================================================

    return response;

  } catch (error) {
    console.error(
      "Image service error:",
      error
    );

    throw error;
  }
};