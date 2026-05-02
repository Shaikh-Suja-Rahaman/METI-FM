import type { Request, Response } from "express";
import dotenv from 'dotenv'
import { GoogleGenAI } from "@google/genai";
import systemPrompt from "../prompts/gentleListener.ts";


dotenv.config();

const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
})

type Message = { //type of Message
  role: string;
  message: string;
}

// export const fullConvo = async (contents: Message[]) =>{ //accepts an array of Messages
//   let  result = "";
//   contents.forEach(content => {
//     result = result + content.role +" : "+ content.message + "\n";
//   });

//   const summarizeFromLLM = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Summarize the following conversation, keeping the role based talking style, so that its understandable who is talking to whom. \n "+result,
//   });

//   return summarizeFromLLM.text; //formats it so that i can have full convo.
// }

export const fullConvo = async (contents: Message[]): Promise<string> =>{ //accepts an array of Messages

  let  result = "";
  contents.forEach(content => {
    result = result + content.role +" : "+ content.message + "\n";
  });

  const summarizeFromLLM = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Summarize the following conversation.

IMPORTANT:
- Keep roles (user vs assistant)
- DO NOT preserve tone or personality
- Keep it neutral and factual
- Focus only on what was said, not how it was said

${result}
`
  });

  // res.status(200).send(summarizeFromLLM.text); //formats it so that i can have full convo.
  return summarizeFromLLM.text ?? ""; //return the text received from llm.

}

export const sendGentleResponse = async (req:Request, res:Response) =>{

  let query:Message[] = req.body.contents; //should be an array of all the conversations
  let olderquery:Message[] = query.slice(0,-1);

  let conversationSummary:string = await fullConvo(olderquery);

  const latestMessage = query[query.length - 1];

  const finalPrompt = `
    You MUST strictly follow this personality:

    ${systemPrompt}

    ---

    Conversation context (neutral summary of past interaction):
    ${conversationSummary}

    ---

    Latest message:
    ${latestMessage.role}: ${latestMessage.message}

    ---

      Instructions:
  - Stay in character
  - Do NOT mention the summary
  - Respond only to the latest message

  Now respond:
  `;


  const responseFromLLM = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: finalPrompt,
  });

  res.status(200).send(responseFromLLM.text);

}