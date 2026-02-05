
const GEMINI_API_KEY = 'AIzaSyAu4n1k6gvv0BaLa4cF-eKUgbYgWamNdME';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;


/**
 * Get AI mentor response from Gemini
 * @param {Array<{text: string, role: 'user' | 'model'}>} history 
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export const getAIMentorResponse = async (history, prompt) => {
  try {
    
    const systemContext = `Siz startup sohasida tajribali mentor va maslahatchi siz. Foydalanuvchilarga startup yaratish, jamoa qurish, biznes rejalashtirish va boshqa startup bilan bog'liq savollar bo'yicha yordam bering. Javoblaringiz qisqa, aniq va amaliy bo'lsin. O'zbek tilida javob bering.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemContext }]
      },
      {
        role: 'model',
        parts: [{ text: 'Tushundim. Men sizga startup sohasida yordam berish uchun tayyorman. Savolingizni bering!' }]
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI bilan bog\'lanishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
  }
};

export const getMockAIResponse = async (history, prompt) => {

  await new Promise(resolve => setTimeout(resolve, 1000));

  const responses = [
    "Bu juda qiziqarli savol! Startup yaratishda eng muhimi - muammoni aniqlash va uni yechish uchun innovative yondashuv topish.",
    "Jamoa - startupning asosi. Har bir a'zo o'z sohasida professional bo'lishi kerak. Diversifikatsiya muhim!",
    "Biznes modelingizni sinchiklab o'ylab chiqing. Daromad manbalarini oldindan rejalashtiring.",
    "Dastlabki foydalanuvchilarni topish uchun minimal mahsulot (MVP) yarating va ulardan feedback oling.",
    "Moliyalashtirish uchun turli variantlarni ko'rib chiqing: bootstrapping, angel investors, venture capital.",
    "Marketing strategiyasi juda muhim. Maqsadli auditoriyangizni aniqlang va ularga to'g'ridan-to'g'ri murojaat qiling."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return randomResponse;
};
