import React, { useEffect, useRef, useState } from "react";
import AssistantChatBubble from "./AssistantChatBubble";
import UserChatBubble from "./UserChatBubble";
import { Send } from "lucide-react";
import axios from "axios";

type FullChatProps = {
  persona: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

type Message = {
  role: string;
  message: string;
};

const personaLabels: Record<string, string> = {
  chillFriend: "Chill Friend",
  gentleListener: "Gentle Listener",
  harshCoach: "Harsh Coach",
};

const FullChat = ({ persona, messages, setMessages }: FullChatProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setText("");
    setSending(true);

    const userMessage = { role: "user", message: trimmed };
    setMessages((prev) => [...(prev || []), userMessage]);

    try {
      const payload = { contents: [...(messages || []), userMessage] };
      const response = await axios.post(
        `http://localhost:5001/api/chat/${persona}`,
        payload
      );
      setMessages((prev) => [
        ...(prev || []),
        { role: "assistant", message: response.data },
      ]);
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      const errorMsg = isRateLimit
        ? "⏳ Slow down! You're sending messages too fast. Wait a moment and try again."
        : "Something went wrong. Try again?";
      setMessages((prev) => [
        ...(prev || []),
        { role: "assistant", message: errorMsg },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="neo-chat">
      {/* Header */}
      <div className={`neo-chat-header neo-chat-header--${persona}`}>
        <div className="neo-chat-title">{personaLabels[persona] || persona}</div>
        <span className={`neo-pill neo-pill--${persona}`}>
          {personaLabels[persona] || persona}
        </span>
      </div>

      {/* Messages */}
      <div className="neo-chat-body" ref={bodyRef}>
        {messages && messages.length > 0 ? (
          messages.map((msg, index) =>
            msg.role === "user" ? (
              <UserChatBubble key={index} text={msg.message} />
            ) : msg.role === "assistant" ? (
              <AssistantChatBubble key={index} text={msg.message} />
            ) : null
          )
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.45, fontSize: "14px", fontWeight: 600 }}>
            Say something to get the conversation started ✌️
          </div>
        )}
        {sending && (
          <div className="bubble-row bubble-row--assistant">
            <div className="bubble bubble-assistant" style={{ opacity: 0.6, fontStyle: "italic" }}>
              typing…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="neo-chat-footer">
        <form onSubmit={sendMessage} className="neo-input-row">
          <input
            type="text"
            placeholder="Type a message…"
            className="neo-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <button type="submit" className="neo-send" disabled={sending} aria-label="Send">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullChat;
