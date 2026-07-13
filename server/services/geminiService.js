import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const improveComplaint = async (description) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for a Smart City Complaint Management System.

Your job is to improve citizens' complaints before they are submitted.

Instructions:

1. Rewrite the complaint into a professional municipal complaint.
2. Use clear and polite language.
3. Correct grammar and spelling.
4. Keep the original meaning.
5. Write 2-4 complete sentences.
6. Do NOT return short phrases like:
   - "Water related issue"
   - "Road issue"
   - "Garbage issue"
7. Mention the actual problem clearly.
8. End with a polite request like:
   "Kindly resolve the issue as soon as possible."

Return ONLY valid JSON.

Format:

{
  "improvedDescription": "",
  "category": "",
  "priority": "",
  "department": ""
}

Category must be exactly one of:

Road
Water
Garbage
Electricity
Drainage
Street Light
Others

Priority must be exactly one of:

High
Medium
Low

Departments:

Road -> Public Works Department

Water -> Water Supply Department

Garbage -> Sanitation Department

Electricity -> Electricity Department

Drainage -> Drainage Department

Street Light -> Street Light Department

Others -> Municipal Office

Return ONLY JSON.
`,
        },

        {
          role: "user",
          content: description,
        },
      ],

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

    const aiResponse = completion.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    return JSON.parse(aiResponse);

  } catch (error) {
    console.error("Groq AI Error:", error);
    throw error;
  }
};