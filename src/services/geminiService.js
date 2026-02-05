export const getAIMentorResponse = async (prompt) => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": AIzaSyCuooFnXPmOdtYi4e8_ri3dCqF3kgVOpow,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Siz startup mentoriz. Qisqa va aniq javob bering. O'zbek tilida gapiring.`
              }
            ]
          },
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Javob yo‘q";
};
