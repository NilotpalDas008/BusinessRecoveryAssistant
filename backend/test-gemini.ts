import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Reply with only the word OK",
    });

    console.log("SUCCESS:");
    console.log(response.text);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

test();