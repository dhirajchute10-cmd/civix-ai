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

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved",
      ],
      default: "Pending",
    },

    tracking: [
      {
        status: {
          type: String,
        },

        message: {
          type: String,
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