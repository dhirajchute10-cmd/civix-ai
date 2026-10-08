import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Road",
        "Water",
        "Electricity",
        "Garbage",
        "Drainage",
        "Street Light",
        "Others",
      ],
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    department: {
      type: String,
      enum: [
        "Public Works Department",
        "Water Supply Department",
        "Sanitation Department",
        "Electricity Department",
        "Drainage Department",
        "Street Light Department",
        "Municipal Office",
      ],
      default: "Municipal Office",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    tracking: [
      {
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Resolved"],
        },

        message: {
          type: String,
          trim: true,
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Complaint", complaintSchema);