import type { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import systemPrompt from "../prompts/theHorde.ts";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

export type Message = {
  role: string;
  message: string;
};

export const sendHordeResponse = async (req: Request, res: Response) => {
  try {
    const query: Message[] = req.body.contents;
    const recentMessages = query.slice(-10);

    const customApiKey = req.headers['x-nvidia-api-key'] as string | undefined;
    const activeClient = customApiKey
      ? new OpenAI({ baseURL: "https://integrate.api.nvidia.com/v1", apiKey: customApiKey })
      : client;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((msg) => ({
        role: (msg.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: msg.message,
      })),
    ];

    const completion = await activeClient.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: openaiMessages,
      temperature: 0.9,
      top_p: 0.9,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content ?? "...";
    res.status(200).send(reply);
  } catch (error: any) {
    console.error("Error generating THE HORDE response:", error);
    const status = error?.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Rate limit hit — wait a moment and try again."
        : "Error generating response";
    res.status(status).send(message);
  }
};
