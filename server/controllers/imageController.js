import cloudinary from "../config/cloudinary.js";

import {
  analyzeComplaintImage,
} from "../services/visionService.js";

// =========================================================
// UPLOAD BUFFER TO CLOUDINARY
// =========================================================

const uploadToCloudinary = (
  buffer,
  mimeType
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "CIVIX-AI",
          resource_type: "image",
        },

        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
};

// =========================================================
// ANALYZE IMAGE
// =========================================================

export const analyzeImage = async (
  req,
  res
) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "CIVIX IMAGE ANALYSIS REQUEST"
    );

    console.log(
      "===================================="
    );

    // =====================================================
    // 1. CHECK UPLOADED FILE
    // =====================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload an image.",
      });
    }

    console.log(
      "File received:"
    );

    console.log({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });

    // =====================================================
    // 2. CHECK IMAGE BUFFER
    // =====================================================

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message:
          "Image data is unavailable.",
      });
    }

    // =====================================================
    // 3. UPLOAD IMAGE TO CLOUDINARY
    // =====================================================

    console.log(
      "Uploading image to Cloudinary..."
    );

    const cloudinaryResult =
      await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );

    const imageUrl =
      cloudinaryResult.secure_url;

    console.log(
      "Cloudinary upload successful."
    );

    console.log(
      "Image URL:",
      imageUrl
    );

    // =====================================================
    // 4. SEND IMAGE TO CIVIX VISION AI
    // =====================================================

    console.log(
      "Sending image to CIVIX Vision AI..."
    );

    const aiResult =
      await analyzeComplaintImage(
        req.file.buffer,
        req.file.mimetype
      );

    console.log(
      "CIVIX Vision AI analysis completed."
    );

    // =====================================================
    // 5. SEND RESPONSE TO FRONTEND
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Image analyzed successfully.",

      imageUrl,

      aiResult,
    });

  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "CIVIX IMAGE ANALYSIS ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Image analysis failed.",
    });
  }
};