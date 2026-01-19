// AI Chat ya Support ke liye logic yahan aayega
export const getGeminiResponse = async (userMessage: string) => {
  try {
    console.log("Gemini query:", userMessage);
    // Future mein yahan Google Gemini API call connect ho sakti hai
    return "Hello! Main AT SCRIMS ka AI assistant hoon. Main aapki kya madad kar sakta hoon?";
  } catch (error) {
    return "Maaf kijiye, abhi system busy hai.";
  }
};
