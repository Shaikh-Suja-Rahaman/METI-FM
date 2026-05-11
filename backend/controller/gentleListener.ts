import { response, type Request, type Response } from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import systemPrompt from "../prompts/gentleListener.ts";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export type Message = {
  //type of Message
  role: string;
  message: string;
};


export const sendGentleResponse = async (req: Request, res: Response) => {
  let query: Message[] = req.body.contents; //should be an array of all the conversations

  const recentMessages = query.slice(-10); //take the last 10 messages

  const geminiContents = recentMessages.map((msg) => {
    return {
      role: msg.role == "assistant" ? "model" : "user",
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
};
