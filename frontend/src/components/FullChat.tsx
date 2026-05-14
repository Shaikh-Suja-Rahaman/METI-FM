import React, { useEffect, useRef, useState } from "react";
import AssistantChatBubble from "./AssistantChatBubble";
import UserChatBubble from "./UserChatBubble";
import { ArrowUp } from "lucide-react";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import FreeLimitModal from "./FreeLimitModal";
import glassPanel from "../assets/realistic-transparent-glass-plate-panel-texture-shiny-glossy-light-glare-reflective-surface-effect-overlay-on-isolated-background-rectangle-gradient-window-png.webp";

type Message = {
  role: string;
  message: string;
};

type FullChatProps = {
  persona: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenSettings: () => void;
};

const personaLabels: Record<string, string> = {
  chillFriend: "Chill Friend",
  gentleListener: "Gentle Listener",
  harshCoach: "Harsh Coach",
};

const personaHeaderColors: Record<string, string> = {
  chillFriend: "bg-vibeSky text-vibeSky-foreground",
  gentleListener: "bg-vibeMint text-vibeMint-foreground",
  harshCoach: "bg-vibeCoral text-vibeCoral-foreground",
};

const FullChat = ({ persona, messages, setMessages, onOpenSettings }: FullChatProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollViewportRef.current) {
      const scrollableNode = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      } else {
        // Fallback
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
      }
    }
  }, [messages]);

    const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // Check limits and keys
    const customKey = localStorage.getItem('customnvidiakey') || '';
    const freeMessagesUsed = parseInt(localStorage.getItem('freemessagess') || '0', 10);

    if (freeMessagesUsed >= 10 && !customKey) {
      setIsLimitModalOpen(true);
      return;
    }

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setSending(true);

    const userMessage = { role: "user", message: trimmed };
    setMessages((prev) => [...(prev || []), userMessage]);

    try {
      const payload = { contents: [...(messages || []), userMessage] };
      const headers: Record<string, string> = {};
      if (customKey) headers['x-nvidia-api-key'] = customKey;

      const response = await axios.post(
        `http://localhost:5001/api/chat/${persona}`,
        payload,
        { headers }
      );

      // Only increment the counter if they're on the free tier
      if (!customKey) {
        localStorage.setItem('freemessagess', (freeMessagesUsed + 1).toString());
      }

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b-2  border-border flex items-center justify-between ${personaHeaderColors[persona] || 'bg-accent text-accent-foreground'}`}>
        {/* <div className="font-display text-xl tracking-tight uppercase">
          {personaLabels[persona] || persona}
        </div> */}
        <span className="inline-block px-3 py-1  rounded-full border-2 border-border bg-background text-foreground text-xs font-bold uppercase tracking-wider neo-shadow-sm">
          {personaLabels[persona] || persona}
        </span>
      </div>

      {/* Messages */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollViewportRef}>
          <div className="flex flex-col mx-auto w-full pt-4">
            {messages && messages.length > 0 ? (
              messages.map((msg, index) =>
                msg.role === "user" ? (
                  <UserChatBubble key={index} text={msg.message} colorClass={personaHeaderColors[persona]} />
                ) : msg.role === "assistant" ? (
                  <AssistantChatBubble key={index} text={msg.message} />
                ) : null
              )
            ) : (
              <div className="flex items-center justify-center h-48 opacity-50 text-sm font-bold mt-12">
                Say something to get the conversation started
              </div>
            )}
            {sending && (
              <div className="flex w-full justify-start mb-4 pl-3">
                <div className="max-w-[80%] bg-card text-muted-foreground p-3 rounded-xl rounded-tl-sm border-2 border-border italic text-sm font-medium">
                  typing…
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-border bg-card">
        <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto w-full">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Type a message…"
            className="flex-1 max-h-[200px] py-3 px-4 resize-none rounded-md border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:ring-0 focus:border-border neo-shadow-sm placeholder:text-muted-foreground disabled:opacity-50"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              // Add 4px to account for the border-2 (2px top + 2px bottom) under border-box sizing
              e.target.style.height = `${e.target.scrollHeight + 4}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={sending}
          />
          <button
            type="submit"
            className={`px-5 flex items-center justify-center rounded-md border-2 border-border neo-shadow-sm disabled:opacity-50 disabled:pointer-events-none ${personaHeaderColors[persona] || 'bg-foreground text-background'}`}
            disabled={sending}
            aria-label="Send"
          >
            <ArrowUp size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      <FreeLimitModal
        open={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
};

export default FullChat;
