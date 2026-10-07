import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Allowed values for CIVIX
const VALID_CATEGORIES = [
  "Road",
  "Water",
  "Garbage",
  "Electricity",
  "Drainage",
  "Street Light",
  "Others",
];

const VALID_SEVERITIES = [
  "High",
  "Medium",
  "Low",
];

export const analyzeComplaintImage = async (
  imageBuffer,
  mimeType = "image/jpeg"
) => {
  try {
    // =====================================================
    // 1. VALIDATE IMAGE
    // =====================================================

    if (!imageBuffer) {
      throw new Error("Image data is missing.");
    }

    if (!mimeType.startsWith("image/")) {
      throw new Error(
        "Uploaded file is not a valid image."
      );
    }

    // =====================================================
    // 2. CONVERT IMAGE TO BASE64
    // =====================================================

    const base64Image =
      imageBuffer.toString("base64");

    const imageDataUrl =
      `data:${mimeType};base64,${base64Image}`;

    console.log(
      "Sending image to CIVIX Vision AI..."
    );

    // =====================================================
    // 3. SEND IMAGE TO GROQ VISION
    // =====================================================

    const completion =
      await groq.chat.completions.create({
        model: "qwen/qwen3.8-27b",

        messages: [
          {
            role: "system",

            content: `
You are CIVIX AI Vision, an AI assistant for a
municipal civic complaint management system.

Your job is to carefully inspect the uploaded image
and determine whether it shows a visible civic,
municipal, public infrastructure, or sanitation problem.

Examples of civic problems:

- Potholes
- Damaged roads
- Road cracks
- Broken pavement
- Garbage accumulation
- Overflowing garbage bins
- Water leakage
- Waterlogging
- Drainage problems
- Broken street lights
- Damaged electrical infrastructure
- Other visible public infrastructure problems

IMPORTANT RULES:

1. Actually inspect the image.
2. Do NOT invent a problem.
3. Do NOT assume that a civic issue exists.
4. Base the answer only on what is visibly present.
5. A selfie or portrait is NOT a civic issue.
6. A person's face or appearance is NOT a civic issue.
7. A random personal photo is NOT a civic issue.
8. An unrelated object or indoor personal photo is NOT a civic issue.
9. Do not identify people.
10. Do not describe a person's identity.
11. Select the category based on visible evidence.
12. Estimate severity only from the visible condition.
13. Return ONLY valid JSON.
14. Do not return Markdown.
15. Do not return code fences.
16. Do not write any explanation outside JSON.

Allowed categories:

Road
Water
Garbage
Electricity
Drainage
Street Light
Others

Allowed severities:

High
Medium
Low

Return EXACTLY this JSON structure:

{
  "civicIssue": true,
  "detectedIssue": "string",
  "category": "string",
  "severity": "string",
  "summary": "string",
  "recommendedAction": "string"
}

WHEN A CIVIC ISSUE IS CLEARLY VISIBLE:

civicIssue:
true

detectedIssue:
Short name of the visible problem.

category:
Best matching category.

severity:
High, Medium, or Low.

summary:
One or two sentences describing only
what is visible in the image.

recommendedAction:
A practical municipal action.

WHEN NO CIVIC ISSUE IS CLEARLY VISIBLE:

civicIssue:
false

detectedIssue:
"No civic issue detected"

category:
"Others"

severity:
"Low"

summary:
"The uploaded image does not clearly show a municipal or public infrastructure problem."

recommendedAction:
"Please upload a clear photo showing the civic issue."

Do not guess.
Do not hallucinate.
Do not invent a civic problem.
`,
          },

          {
            role: "user",

            content: [
              {
                type: "text",

                text:
                  "Carefully inspect the uploaded image. Determine whether it shows a genuine civic complaint and return only the required JSON.",
              },

              {
                type: "image_url",

                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],

        temperature: 0.1,

        max_completion_tokens: 700,

        response_format: {
          type: "json_object",
        },
      });

    // =====================================================
    // 4. GET RAW AI RESPONSE
    // =====================================================

    const rawContent =
      completion.choices?.[0]?.message?.content;

    console.log(
      "RAW CIVIX VISION RESPONSE:"
    );

    console.log(rawContent);

    if (!rawContent) {
      throw new Error(
        "Vision AI returned an empty response."
      );
    }

    // =====================================================
    // 5. PARSE JSON
    // =====================================================

    let result;

    try {
      result = JSON.parse(rawContent);
    } catch (error) {
      console.error(
        "Vision AI JSON parsing failed:",
        error
      );

      throw new Error(
        "Vision AI returned invalid JSON."
      );
    }

    // =====================================================
    // 6. NORMALIZE CIVIC ISSUE
    // =====================================================

    const civicIssue =
      result.civicIssue === true;

    // =====================================================
    // 7. VALIDATE CATEGORY
    // =====================================================

    let category =
      VALID_CATEGORIES.includes(
        result.category
      )
        ? result.category
        : "Others";

    // =====================================================
    // 8. VALIDATE SEVERITY
    // =====================================================

    let severity =
      VALID_SEVERITIES.includes(
        result.severity
      )
        ? result.severity
        : "Low";

    // =====================================================
    // 9. VALIDATE DETECTED ISSUE
    // =====================================================

    let detectedIssue =
      typeof result.detectedIssue ===
        "string" &&
      result.detectedIssue.trim()
        ? result.detectedIssue.trim()
        : "No civic issue detected";

    // =====================================================
    // 10. VALIDATE SUMMARY
    // =====================================================

    let summary =
      typeof result.summary === "string" &&
      result.summary.trim()
        ? result.summary.trim()
        : "The uploaded image was analyzed by CIVIX AI.";

    // =====================================================
    // 11. VALIDATE RECOMMENDED ACTION
    // =====================================================

    let recommendedAction =
      typeof result.recommendedAction ===
        "string" &&
      result.recommendedAction.trim()
        ? result.recommendedAction.trim()
        : "Please review the image and complaint details.";

    // =====================================================
    // 12. HANDLE NON-CIVIC IMAGES
    // =====================================================

    if (!civicIssue) {
      category = "Others";

      severity = "Low";

      detectedIssue =
        "No civic issue detected";

      if (
        typeof result.summary !== "string" ||
        !result.summary.trim()
      ) {
        summary =
          "The uploaded image does not clearly show a municipal or public infrastructure problem.";
      }

      if (
        typeof result.recommendedAction !==
          "string" ||
        !result.recommendedAction.trim()
      ) {
        recommendedAction =
          "Please upload a clear photo showing the civic issue.";
      }
    }

    // =====================================================
    // 13. FINAL CLEAN RESULT
    // =====================================================

    const finalResult = {
      civicIssue,
      detectedIssue,
      category,
      severity,
      summary,
      recommendedAction,
    };

    console.log(
      "FINAL CIVIX VISION RESULT:"
    );

    console.log(finalResult);

    return finalResult;

  } catch (error) {
    console.error(
      "CIVIX VISION SERVICE ERROR:"
    );

    console.error(error);

    throw error;
  }
};