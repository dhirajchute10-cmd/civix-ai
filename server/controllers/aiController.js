import {
  improveComplaint,
  chatWithAI,
} from "../services/geminiService.js";


export const improveComplaintAI = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const aiResult = await improveComplaint(description);

    res.status(200).json({
      success: true,
      data: aiResult,
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI processing failed",
    });
  }
};


export const chatAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await chatWithAI(
      message.trim(),
      history
    );

    return res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });

  } catch (error) {
    console.error("Chat AI Error:", error);

    return res.status(500).json({
      success: false,
      message: "Chatbot is temporarily unavailable",
    });
  }
};