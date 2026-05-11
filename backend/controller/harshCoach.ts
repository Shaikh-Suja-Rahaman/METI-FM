import type { Request, Response } from "express";
import dotenv from 'dotenv'
import { GoogleGenAI } from "@google/genai";
import systemPrompt from "../prompts/harshCoach.ts";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
})

export type Message = {
  role: string;
  message: string;
}

export const sendHarshResponse = async (req: Request, res: Response) => {
  try {
    let query: Message[] = req.body.contents;

    const recentMessages = query.slice(-10);

    const geminiContents = recentMessages.map((msg) => {
      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.message }],
      };
    });

    const responseFromLLM = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: geminiContents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.status(200).send(responseFromLLM.text);
  } catch (error) {
    console.error("Error generating harsh response:", error);
    res.status(500).send("Error generating response");
  }
}
