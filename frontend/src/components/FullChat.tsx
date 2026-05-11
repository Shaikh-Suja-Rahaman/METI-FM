import React, { useEffect, useState } from "react";
import AssistantChatBubble from "./AssistantChatBubble";
import UserChatBubble from "./UserChatBubble";
import { Send, User } from "lucide-react";
import axios from "axios";

type FullCharProps = {
  persona: string;
};

type Message = {
  //type of Message
  role: string;
  message: string;
};

const FullChat = ({ persona }: FullCharProps) => {
  let [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(text);
    // setMessages((prev) => [...prev, text]);
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     role: "user",
    //     message: text,
    //   },
    // ]);

    // let payload = {
    //   contents: messages,
    // };
    const userMessage = {
  role: "user",
  message: text,
};

setMessages((prev) => [
  ...prev,
  userMessage,
]);

const payload = {
  contents: [...messages, userMessage],
};

    let response = await axios.post(
      "http://localhost:5001/api/chat/chillFriend",
      payload,
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        message: response.data.message,
      },
    ]);


    // console.log(messages);

    setText("");
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-[90vh] w-[90vw]">
      {/* Chat area */}
      <div className="chatArea flex-1 bg-blue-300 overflow-y-auto p-4">
        {/* <AssistantChatBjjjjjubble text="Hey! How can I help you today?" />
        <UserChatBubble text="Hey, I’m trying to build a chat UI in React." />

        <AssistantChatBubble text="Nice, that’s a great project. Are you working with Tailwind?" /> */}
        {messages.map((msg, index) => {
          if (msg.role == "user") {
            return <UserChatBubble key={index} text={msg.message} />;
          } else if(msg.role == "assistant")  {
            return <AssistantChatBubble key={index} text={msg.message}/>;
          }
        })}
      </div>

      {/* Input box */}
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            placeholder="write a message"
            className="flex-1 border rounded px-3 py-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="border">
            <Send size={30} className="m-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default FullChat;
