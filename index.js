/**
 * Gemini Arabic Toolkit - دالة أساسية للتواصل مع Gemini API
 */

async function callGemini(prompt, apiKey, options = {}) {
  const model = options.model || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 1024,
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    return text.trim();
  } catch (error) {
    console.error("callGemini failed:", error.message);
    throw error;
  }
}

module.exports = { callGemini };
