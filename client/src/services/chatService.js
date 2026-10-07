import axios from "axios";

import { governmentServices } from "../data/governmentServices";

const API = "http://localhost:5000/api/ai";

export const getChatReply = (key) => {
  if (key === "documents") {
    let reply = "Government Services\n\n";

    governmentServices.forEach((service) => {
      reply += `• ${service.name}\n`;
    });

    reply += "\nType a service name to view its documents.";

    return reply;
  }

  if (key === "services") {
    let reply = "Available Government Services\n\n";

    governmentServices.forEach((service) => {
      reply += `• ${service.name}\n`;
    });

    reply += "\nType a service name to know more.";

    return reply;
  }

  if (key === "complaint") {
    return `Complaint Registration

1. Login to CIVIX.
2. Open Report Complaint.
3. Select the complaint category.
4. Enter the complaint description.
5. Add the location.
6. Add an image if available.
7. Submit the complaint.
8. Track it from My Complaints.`;
  }

  if (key === "tracking") {
    return `Complaint Tracking

1. Login to CIVIX.
2. Open My Complaints.
3. Select your complaint.
4. View the current status and tracking history.`;
  }

  if (key === "emergency") {
    return `Emergency Numbers

Police: 100
Fire: 101
Ambulance: 108
Women Helpline: 1091`;
  }

  return "How can I help you?";
};

export const sendChatMessage = async (message, history = []) => {
  try {
    const response = await axios.post(`${API}/chat`, {
      message: message.trim(),
      history,
    });

    return (
      response.data?.data?.reply ||
      "Sorry, I could not generate a response right now."
    );
  } catch (error) {
    console.error("Chat API Error:", error);

    return "Sorry, the AI assistant is temporarily unavailable. Please try again.";
  }
};