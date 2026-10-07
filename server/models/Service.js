import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    documents: [
      {
        type: String,
      },
    ],

    process: [
      {
        type: String,
      },
    ],

    eligibility: {
      type: String,
      default: "Please check the official government guidelines.",
    },

    processingTime: {
      type: String,
      default: "7 Days",
    },

    fees: {
      type: String,
      default: "Free",
    },

    applyLink: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "📄",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);