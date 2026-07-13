import Complaint from "../models/Complaint.js";

// Create Complaint
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;

    // Validation
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: image || "",
      citizen: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get My Complaints
export const getMyComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      citizen: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Dashboard Statistics
export const getComplaintStats = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      citizen: req.user._id,
    });

    const total = complaints.length;

    const pending = complaints.filter(
      (c) => c.status === "Pending"
    ).length;

    const inProgress = complaints.filter(
      (c) => c.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
      (c) => c.status === "Resolved"
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Get Complaint By ID
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Security: only owner can view
    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Recent Complaints
export const getRecentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Complaint
export const updateComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Only owner can update
    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Don't allow editing after resolution
    if (complaint.status === "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Resolved complaints cannot be edited",
      });
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.category = category || complaint.category;
    complaint.location = location || complaint.location;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Complaint
export const deleteComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be deleted",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};