import cloudinary from "../config/cloudinary.js";
import { improveComplaint } from "../services/geminiService.js";

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = req.file.path;

    // Temporary AI prompt (Vision integration in next step)
    const aiResult = await improveComplaint(
      "Analyze this uploaded complaint image."
    );

    res.status(200).json({
      success: true,
      imageUrl,
      aiResult,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Image analysis failed",
    });
  }
};