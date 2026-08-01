import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

(async () => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Hello",
    });

    console.log(result.text);
  } catch (e) {
    console.error(e);
  }
})();