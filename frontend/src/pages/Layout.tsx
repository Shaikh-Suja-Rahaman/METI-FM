import React, { useEffect, useState } from 'react'
import FullChat from '../components/FullChat'
import { Persona } from '../PersonaType'
import HistoryBar from '../components/HistoryBar';
import PersonaSelect from '../components/PersonaSelect';

export type Message = {
  role: string;
  message: string;
};

export type Conversation = {
  id: string;
  persona: string;
  title: string;
  createdAt: number;
  messages: Message[];
};

/** Derive a friendly title from the first user message */
const deriveTitle = (messages: Message[]): string => {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'New Conversation';
  const text = firstUser.message.trim();
  return text.length > 38 ? text.slice(0, 36) + '…' : text;
};

const Layout = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>(Persona.chillFriend);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("conversations") || "[]");
    } catch {
      localStorage.removeItem("conversations");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const createNewChat = () => {
    const newConvo: Conversation = {
      id: Date.now().toString(),
      persona: selectedPersona,
      title: "New Conversation",
      createdAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [...prev, newConvo]);
    setActiveConversationId(newConvo.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    // If the deleted chat was active, deselect
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversation?.messages || [];

  const setCurrentMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setConversations(prev => prev.map(convo => {
      if (convo.id !== activeConversationId) return convo;
      const newMessages = typeof updater === 'function' ? updater(convo.messages) : updater;
      // Auto-update the title once the first user message arrives
      const newTitle = convo.title === 'New Conversation' ? deriveTitle(newMessages) : convo.title;
      return { ...convo, messages: newMessages, title: newTitle };
    }));
  };

  return (
    <div className="neo-shell">
      {/* ── Sidebar ── */}
      <aside className="neo-sidebar">
        {/* Brand + controls */}
        <div className="neo-card neo-panel">
          <div className="neo-brand">
            <div className="neo-title">Mood Space</div>
            <div className="neo-subtitle">Your neobrutalist vibe lab</div>
          </div>

          <label className="neo-label" htmlFor="persona-select">Persona</label>
          <PersonaSelect
            value={selectedPersona}
            onChange={setSelectedPersona}
          />

          <button onClick={createNewChat} className="neo-btn">
            + New Chat
          </button>
        </div>

        {/* History */}
        <div className="neo-card neo-history">
          <div className="neo-section-title">History</div>
          <HistoryBar
            conversations={conversations}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            onDelete={deleteConversation}
          />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="neo-main">
        {activeConversationId && activeConversation
          ? (
            <FullChat
              persona={activeConversation.persona}
              messages={currentMessages}
              setMessages={setCurrentMessages}
            />
          )
          : (
            <div className="neo-empty-state">
              <div className="neo-empty-icon">💬</div>

              <div>
                <div className="neo-empty-heading">Start a new vibe</div>
                <div className="neo-empty-sub" style={{ marginTop: 8 }}>
                  Pick a persona, hit <strong>+ New Chat</strong>, and let the conversation flow.
                </div>
              </div>

              <div className="neo-empty-hint">
                <div className="neo-empty-step">
                  <div className="neo-empty-step-num">1</div>
                  Choose a persona from the sidebar
                </div>
                <div className="neo-empty-step">
                  <div className="neo-empty-step-num" style={{ background: 'var(--a-mint)' }}>2</div>
                  Hit <strong style={{ marginLeft: 4 }}>+ New Chat</strong> to begin
                </div>
                <div className="neo-empty-step">
                  <div className="neo-empty-step-num" style={{ background: 'var(--a-coral)', color: '#fff' }}>3</div>
                  Type your first message ✌️
                </div>
              </div>
            </div>
          )
        }
      </main>
    </div>
  );
};

export default Layout;