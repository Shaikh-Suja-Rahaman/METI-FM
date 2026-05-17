import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Radio } from 'lucide-react';
import axios from 'axios';
import { ScrollArea } from './ui/scroll-area';
import FreeLimitModal from './FreeLimitModal';
import { ENTITY_MAP, getNearestEntity } from '../entities';

type Message = {
  role: string;
  message: string;
};

type ChatWindowProps = {
  entityId: string;
  frequencyMhz: number;
  messages: Message[];
  setMessages: (updater: Message[] | ((prev: Message[]) => Message[])) => void;
  frequencyLevel: number;
  currentFrequency: number;
  onReTune: () => void;
  onOpenSettings: () => void;
};

/** Word-by-word renderer for THE SIGNAL */
const SignalMessage: React.FC<{ text: string }> = ({ text }) => (
  <span>
    {text.split(' ').map((word, i) => (
      <span key={i} className="signal-word" style={{ animationDelay: `${i * 220}ms` }}>
        {word}{i < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ))}
  </span>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://meti-fm.onrender.com';

const ChatWindow: React.FC<ChatWindowProps> = ({
  entityId, frequencyMhz, messages, setMessages,
  frequencyLevel, currentFrequency, onReTune, onOpenSettings,
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const entity   = ENTITY_MAP[entityId];
  const isLight  = entity?.side === 'light';
  const isSignal = entityId === 'theSignal';

  // Frequency lock: the dial's nearest entity must match this conversation's entity
  const dialEntity = getNearestEntity(currentFrequency);
  const isLocked   = dialEntity.id !== entityId;

  const isDarkZone = frequencyLevel < 0.22;
  const isDeep     = frequencyLevel < 0.12;
  const isExtreme  = frequencyLevel < 0.06;

  // Auto-scroll
  useEffect(() => {
    const vp = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (vp) vp.scrollTop = vp.scrollHeight;
    else if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !entity || isLocked) return;

    const customKey = localStorage.getItem('customnvidiakey') || '';
    const freeUsed  = parseInt(localStorage.getItem('freemessagess') || '0', 10);
    if (freeUsed >= 10 && !customKey) { setIsLimitModalOpen(true); return; }

    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setSending(true);

    const userMsg: Message = { role: 'user', message: trimmed };
    setMessages(prev => [...(prev || []), userMsg]);

    try {
      const headers: Record<string, string> = {};
      if (customKey) headers['x-nvidia-api-key'] = customKey;
      const res = await axios.post(
        `${API_BASE_URL}/api/chat/${entity.route}`,
        { contents: [...(messages || []), userMsg] },
        { headers }
      );
      if (!customKey) localStorage.setItem('freemessagess', (freeUsed + 1).toString());
      setMessages(prev => [...(prev || []), { role: 'assistant', message: res.data }]);
    } catch (err: any) {
      const msg = err?.response?.status === 429
        ? '⏳ Signal overloaded. Wait before attempting contact again.'
        : 'Signal lost. The frequency is unstable.';
      setMessages(prev => [...(prev || []), { role: 'assistant', message: msg }]);
    } finally {
      setSending(false);
    }
  };

  const entityColorStyle = {
    backgroundColor: entity?.hexColor || '#888',
    color: isLight ? '#0f0f0f' : '#f0ece0',
  };

  // Conv entity data for the re-tune banner (use conversation's entity, not dial entity)
  const convEntity = entity;

  return (
    <div className={`flex flex-col h-full overflow-hidden ${isExtreme ? 'meti-flickering' : ''}`}>

      {/* ── Header ── */}
      <div className={`px-5 py-2.5 border-b-2 border-border flex items-center gap-3 flex-wrap ${isDarkZone ? 'bg-black/80 border-gray-700' : 'bg-card'} ${isDeep ? 'meti-shaking' : ''}`}
        style={isDeep ? { '--decay-shake': '1px', '--decay-tilt': '0deg' } as React.CSSProperties : {}}
      >
        {/* Entity tag */}
        <span
          className={`inline-block px-3 py-1 border-2 border-border text-xs font-bold uppercase tracking-wider ${isDeep && !isSignal ? 'meti-glitch-text' : ''}`}
          style={{ ...entityColorStyle, borderRadius: '2px' }}
        >
          {entity?.name || entityId}
        </span>
        <span className="font-mono text-[10px] opacity-40 tracking-widest">
          {frequencyMhz.toFixed(1)} MHz
        </span>
        {isDarkZone && !isLocked && (
          <span className="ml-auto text-[9px] font-mono text-red-400 opacity-60 uppercase tracking-wider">⚠ RESTRICTED</span>
        )}

        {/* ── Frequency lock warning + re-tune button ── */}
        {isLocked && (
          <div className="ml-auto flex items-center gap-2">

            <button
              onClick={onReTune}
              className="flex items-center gap-1.5 px-3 py-1 border-2 border-border text-[10px] font-bold uppercase tracking-wider neo-shadow-sm"
              style={{ ...entityColorStyle, borderRadius: '2px' }}
            >
              <Radio size={10} />
              Re-tune
            </button>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="flex flex-col gap-4 p-5 pt-6">
            {(!messages || messages.length === 0) && (
              <div className="flex items-center justify-center h-40 opacity-30 text-sm font-mono text-center">
                {isDarkZone
                  ? '[ SIGNAL DETECTED — TRANSMIT TO ESTABLISH CONTACT ]'
                  : '[ FREQUENCY LOCKED — SEND FIRST TRANSMISSION ]'}
              </div>
            )}

            {messages?.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {isUser ? (
                    <div
                      className={`max-w-[78%] px-4 py-2.5 border-2 border-border text-sm font-medium leading-relaxed ${isDeep ? 'meti-glitch-text' : ''}`}
                      style={{ ...entityColorStyle, boxShadow: 'var(--shadow-neo-sm)', borderRadius: '4px 4px 0 4px' }}
                    >
                      {msg.message}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] px-4 py-3 border-2 text-sm leading-relaxed ${isDarkZone ? 'bg-black/60 text-gray-200 border-gray-700' : 'bg-card text-foreground border-border'} ${isDeep && !isSignal ? 'meti-glitch-text' : ''}`}
                      style={{ borderRadius: '0 4px 4px 4px', boxShadow: isDarkZone ? 'none' : 'var(--shadow-neo-sm)' }}
                    >
                      {isSignal ? <SignalMessage text={msg.message} /> : msg.message}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-2 border-2 text-sm italic opacity-60 ${isDarkZone ? 'bg-black/50 text-gray-400 border-gray-700' : 'bg-card text-muted-foreground border-border'}`}
                  style={{ borderRadius: '0 4px 4px 4px' }}
                >
                  {isDarkZone ? '[ decoding signal... ]' : 'transmitting…'}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ── Input ── */}
      <div
        className={`p-4 border-t-2 ${isDarkZone ? 'bg-black/70 border-gray-700' : 'bg-card border-border'}`}
        style={isDeep ? { transform: `rotate(${frequencyLevel < 0.1 ? '-1.5deg' : '-0.8deg'})`, transformOrigin: 'center' } : {}}
      >
        {/* Lock banner */}
        {isLocked && (
          <div className="mb-2 px-3 py-1.5 border border-black bg-gray-950/30 text-white text-[10px] font-mono uppercase tracking-wider text-center" style={{ borderRadius: '2px' }}>
            Retune dial to "{convEntity?.name}" to transmit
          </div>
        )}

        <form onSubmit={sendMessage} className="flex gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={isSignal ? 'Transmit carefully...' : isDarkZone ? 'Transmit signal...' : 'Type a message...'}
            className={`flex-1 max-h-[140px] py-2.5 px-4 resize-none border-2 border-border font-mono text-sm focus:outline-none focus:ring-0 disabled:opacity-50 neo-shadow-sm ${
              isDarkZone ? 'bg-black/60 text-gray-200 border-gray-700 placeholder:text-gray-600' : 'bg-background text-foreground placeholder:text-muted-foreground'
            }`}
            style={{ borderRadius: '2px' }}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight + 4}px`;
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            disabled={sending || isLocked}
          />
          <button
            type="submit"
            disabled={sending || isLocked}
            className="px-4 flex items-center justify-center border-2 border-border disabled:opacity-50 disabled:pointer-events-none neo-shadow-sm"
            style={{ ...entityColorStyle, borderRadius: '2px' }}
            aria-label="Send"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </form>
      </div>

      <FreeLimitModal open={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} onOpenSettings={onOpenSettings} />
    </div>
  );
};

export default ChatWindow;
