/**
 * Calls the Google Gemini API with retry logic and exponential backoff.
 *
 * @param {string} prompt - The user prompt
 * @param {string} systemInstruction - The system instruction for the model
 * @param {string} apiKey - The Gemini API key
 * @param {{ mimeType: string, data: string } | null} inlineData - Optional inline data (e.g. PDF base64)
 * @param {boolean} isJson - Whether to request JSON response format
 * @returns {Promise<string>} The model's text response, or a Turkish error message on failure
 */
export async function callGemini(prompt, systemInstruction, apiKey, inlineData = null, isJson = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt }];
  if (inlineData) {
    parts.push({ inlineData });
  }

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  if (isJson) {
    payload.generationConfig = { responseMimeType: "application/json" };
  }

  const delays = [1000, 2000, 4000, 8000, 16000];
  const retries = 5;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        return "İstek limitine ulaşıldı. Lütfen birkaç saniye bekleyip tekrar deneyin.";
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Bir yanıt oluşturulamadı.";
    } catch (error) {
      if (i === retries) {
        return "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip daha sonra tekrar deneyin.";
      }
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
}
