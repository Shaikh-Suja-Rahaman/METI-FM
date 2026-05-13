import { useEffect, useState } from 'react'
import FullChat from '../components/FullChat'
import { Persona } from '../PersonaType'
import HistoryBar from '../components/HistoryBar';
import PersonaSelect from '../components/PersonaSelect';
import { useTheme } from '../components/ThemeProvider';
import { Moon, Sun, Settings } from 'lucide-react';
import SettingsModal from "../components/settingsModal"

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

const deriveTitle = (messages: Message[]): string => {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'New Conversation';
  const text = firstUser.message.trim();
  return text.length > 38 ? text.slice(0, 36) + '…' : text;
};

const Layout = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>(Persona.chillFriend);
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


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
      const newTitle = convo.title === 'New Conversation' ? deriveTitle(newMessages) : convo.title;
      return { ...convo, messages: newMessages, title: newTitle };
    }));
  };

  return (
    <div className="h-screen w-full flex bg-background text-foreground p-4 gap-4 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-[320px] flex-shrink-0 flex flex-col gap-4">
        {/* Brand + controls */}
        <div className="bg-card border-2 border-border p-6 rounded-xl shadow-neo flex flex-col gap-6 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              className="p-2 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-colors"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              className="p-2 rounded-full border-2 border-transparent hover:border-border hover:bg-muted transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex flex-col gap-1 pr-10">
            <div className="font-brand text-3xl tracking-tight text-foreground font-bold">Mood Space</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Your  vibe lab</div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground">Persona</label>
            <PersonaSelect
              value={selectedPersona}
              onChange={setSelectedPersona}
            />
          </div>

          <button onClick={createNewChat} className={`h-12 flex items-center justify-center font-bold uppercase tracking-widest border-2 border-border rounded-md  neo-shadow-sm transition-all ${selectedPersona === Persona.chillFriend ? "bg-vibeSky text-vibeSky-foreground" : selectedPersona === Persona.gentleListener ? "bg-vibeMint text-vibeMint-foreground" : "bg-vibeCoral text-vibeCoral-foreground"}`}>
            + New Chat
          </button>
        </div>

        {/* History */}
        <div className="bg-card border-2 border-border p-6 rounded-xl shadow-neo flex-1 flex flex-col overflow-hidden">
          <div className="font-display text-xl tracking-tight uppercase text-foreground text-center font-bold ">History</div>
          <HistoryBar
            conversations={conversations}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            onDelete={deleteConversation}
          />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full bg-background bg-grid rounded-xl min-w-0 overflow-hidden border-2 border-border shadow-neo">
        {activeConversationId && activeConversation
          ? (
            <FullChat
              key={activeConversationId}
              persona={activeConversation.persona}
              messages={currentMessages}
              setMessages={setCurrentMessages}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )
          : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center w-full">
              <div className="text-6xl mb-6"></div>

              <div className="mb-12">
                <h1 className="font-brand text-5xl mb-2">Start a new vibe</h1>
                <p className="text-muted-foreground font-medium text-lg">
                  Pick a persona, hit <strong className="text-foreground">+ New Chat</strong>, and let the conversation flow.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-left w-full max-w-md">
                <div className="flex items-center gap-4 bg-background border-2 border-border p-4 rounded-xl shadow-neo-sm font-bold">
                  <div className="w-8 h-8 rounded-full border-2 border-border bg-vibeSky text-vibeSky-foreground flex items-center justify-center text-sm font-display shrink-0">1</div>
                  Choose a persona from the sidebar
                </div>
                <div className="flex items-center gap-4 bg-background border-2 border-border p-4 rounded-xl shadow-neo-sm font-bold">
                  <div className="w-8 h-8 rounded-full border-2 border-border bg-vibeMint text-vibeMint-foreground flex items-center justify-center text-sm font-display shrink-0">2</div>
                  Hit <strong className="text-foreground ml-1">+ New Chat</strong> to begin
                </div>
                <div className="flex items-center gap-4 bg-background border-2 border-border p-4 rounded-xl shadow-neo-sm font-bold">
                  <div className="w-8 h-8 rounded-full border-2 border-border bg-vibeCoral text-vibeCoral-foreground flex items-center justify-center text-sm font-display shrink-0">3</div>
                  Type your first message
                </div>
              </div>
            </div>
          )
        }
      </main>
      <SettingsModal 
        open={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default Layout;