import { useEffect, useMemo, useState } from 'react';
import { Settings } from 'lucide-react';
import FrequencyDial from '../components/FrequencyDial';
import ChatWindow from '../components/ChatWindow';
import HistoryBar, { type ConversationShape } from '../components/HistoryBar';
import AiraBot from '../components/AriaBot';
import DecayOverlay from '../components/DecayOverlay';
import SettingsModal from '../components/settingsModal';
import { getFrequencyLevel, getNearestEntity, DARK_THRESHOLD } from '../entities';

export type Message = {
  role: string;
  message: string;
};

const deriveTitle = (messages: Message[]): string => {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'New Link';
  const text = firstUser.message.trim();
  return text.length > 36 ? text.slice(0, 34) + '…' : text;
};

// ── Decay CSS interpolation ───────────────────────────────────────────────────
// NO CSS filter — controls background/card HSL directly so entity colors stay vivid
const computeDecayVars = (frequencyLevel: number) => {
  const t = Math.max(0, Math.min(1, 1 - frequencyLevel / 0.222)); // 0=safe, 1=full decay

  // Background: warm beige → cold near-black
  const bgHue   = 43 - t * 40;
  const bgSat   = Math.max(2, 33 - t * 30);
  const bgLight = Math.max(8, 91 - t * 80);

  // Card: warm cream → dark gray
  const cardHue   = 48 - t * 40;
  const cardSat   = Math.max(1, 30 - t * 28);
  const cardLight = Math.max(10, 95 - t * 82);

  const crackOpacity = Math.max(0, Math.min(1, (t - 0.3) / 0.6));
  const vineSize     = Math.max(0, (t - 0.35) * 250);
  const shake        = Math.max(0, (t - 0.55) * 6);
  const tilt         = Math.max(0, (t - 0.65) * 6);
  const gridOpacity  = Math.max(0.02, 0.06 - t * 0.04);
  const glitchSpeed  = t > 0.6 ? `${Math.max(1.5, 4 - t * 4)}s` : '0s';

  return {
    '--freq-level':          frequencyLevel,
    '--decay-bg-hue':        `${bgHue}`,
    '--decay-bg-sat':        `${bgSat}%`,
    '--decay-bg-light':      `${bgLight}%`,
    '--decay-crack-opacity': crackOpacity,
    '--decay-vine-size':     `${vineSize}px`,
    '--decay-shake':         `${shake}px`,
    '--decay-tilt':          `${tilt}deg`,
    '--decay-grid-opacity':  gridOpacity,
    '--decay-glitch-speed':  glitchSpeed,
    '--background':          `${bgHue} ${bgSat}% ${bgLight}%`,
    '--card':                `${cardHue} ${cardSat}% ${cardLight}%`,
  };
};

// ── Layout ────────────────────────────────────────────────────────────────────
const Layout = () => {
  const [frequency, setFrequency] = useState<number>(847.3);

  const frequencyLevel = useMemo(() => getFrequencyLevel(frequency), [frequency]);
  const decayVars = useMemo(() => computeDecayVars(frequencyLevel), [frequencyLevel]);

  const isDark    = frequency < DARK_THRESHOLD;
  const isDeep    = frequency < 100;
  const isExtreme = frequency < 50;

  // ── Revealed entities ──
  const [revealedEntities, setRevealedEntities] = useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem('meti-revealed-entities');
      return s ? new Set(JSON.parse(s)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  useEffect(() => {
    localStorage.setItem('meti-revealed-entities', JSON.stringify([...revealedEntities]));
  }, [revealedEntities]);

  // ── Conversations ──
  const [conversations, setConversations] = useState<ConversationShape[]>(() => {
    try { return JSON.parse(localStorage.getItem('meti-conversations') || '[]'); }
    catch { localStorage.removeItem('meti-conversations'); return []; }
  });
  useEffect(() => {
    localStorage.setItem('meti-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ── Select from contact log → also auto-tune dial ──
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const convo = conversations.find(c => c.id === id);
    if (convo) setFrequency(convo.frequencyMhz);
  };

  // ── Establish link ──
  const establishLink = () => {
    const entity = getNearestEntity(frequency);
    if (entity.side === 'dark' && !revealedEntities.has(entity.id)) {
      setRevealedEntities(prev => new Set([...prev, entity.id]));
    }
    const newConvo: ConversationShape = {
      id: Date.now().toString(),
      entityId: entity.id,
      frequencyMhz: entity.mhz,
      title: 'New Link',
      createdAt: Date.now(),
      messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConversationId(newConvo.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) setActiveConversationId(null);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const setCurrentMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setConversations(prev => prev.map(convo => {
      if (convo.id !== activeConversationId) return convo;
      const newMessages = typeof updater === 'function' ? updater(convo.messages) : updater;
      const newTitle = convo.title === 'New Link' ? deriveTitle(newMessages) : convo.title;
      return { ...convo, messages: newMessages, title: newTitle };
    }));
  };

  // Re-tune dial to match the active conversation's entity
  const handleReTune = () => {
    if (activeConversation) setFrequency(activeConversation.frequencyMhz);
  };

  const nearestEntity = useMemo(() => getNearestEntity(frequency), [frequency]);

  const buttonStyle = isDark
    ? { backgroundColor: '#1a0a0a', borderColor: '#5a1a1a', color: '#cc4444' }
    : { backgroundColor: nearestEntity.hexColor, borderColor: '#0f0f0f', color: nearestEntity.side === 'light' ? '#0f0f0f' : '#f0ece0' };

  const titleClass = isDeep
    ? 'font-brand text-3xl tracking-tight font-bold meti-title-glitch'
    : 'font-brand text-3xl tracking-tight font-bold';

  return (
    <div
      className="h-screen w-full flex text-foreground p-4 gap-4 overflow-hidden relative crack-overlay"
      style={{
        ...(decayVars as React.CSSProperties),
        background: `hsl(${decayVars['--decay-bg-hue']} ${decayVars['--decay-bg-sat']} ${decayVars['--decay-bg-light']})`,
      }}
    >
      <DecayOverlay frequencyLevel={frequencyLevel} frequency={frequency} />

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        className={`w-[285px] flex-shrink-0 flex flex-col gap-3 ${isExtreme ? 'meti-shaking' : ''}`}
        style={isExtreme ? { '--decay-shake': '1.5px', '--decay-tilt': '0deg' } as React.CSSProperties : {}}
      >
        {/* ── Brand panel ── */}
        <div
          className={`border-2 p-4 flex flex-col gap-3 relative ${isDark ? 'bg-black/70 border-gray-700' : 'bg-card border-border'}`}
          style={{ borderRadius: '4px', boxShadow: '4px 4px 0 #0f0f0f' }}
        >
          <button
            className="absolute top-3 right-3 p-1.5 border border-transparent hover:border-border hover:bg-muted/50 transition-colors rounded-sm"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Brand */}
          <div className="pr-8">
            <div className={titleClass} style={{ fontFamily: 'Unica One, sans-serif' }}>
              METI FM
            </div>
            <div className={`text-[9px] font-mono uppercase tracking-[0.25em] opacity-60 ${isDeep ? 'meti-glitch-text' : ''}`}>
              Messaging Extraterrestrial Intelligence
            </div>
          </div>

          {/* Frequency readout — compact */}
          <div
            className={`border border-border/40 px-2 py-1.5 flex items-baseline gap-2 justify-center ${isDark ? 'bg-black/50 border-gray-700' : 'bg-background/50'}`}
            style={{ borderRadius: '2px' }}
          >
            <span className={`font-mono text-xl font-bold tracking-widest ${isExtreme ? 'meti-freq-static' : ''} ${isDeep ? 'text-red-400' : isDark ? 'text-amber-400' : 'text-foreground'}`}>
              {frequency.toFixed(1)}
            </span>
            <span className="font-mono text-[9px] opacity-50 uppercase tracking-widest">MHz</span>
            <span
              className="ml-1 px-1.5 py-0.5 text-[8px] font-bold uppercase border"
              style={{ backgroundColor: nearestEntity.hexColor, color: nearestEntity.side === 'light' ? '#0f0f0f' : '#f0ece0', borderColor: 'transparent', borderRadius: '2px' }}
            >
              {(nearestEntity.revealedByDefault || revealedEntities.has(nearestEntity.id)) ? nearestEntity.name : '???'}
            </span>
          </div>

          {/* Frequency Dial */}
          <FrequencyDial frequency={frequency} onChange={setFrequency} revealedEntities={revealedEntities} />

          {/* Establish Link button */}
          <button
            onClick={establishLink}
            className={`h-10 flex items-center justify-center font-bold uppercase tracking-widest border-2 text-sm neo-shadow-sm ${isDeep ? 'meti-shaking' : ''}`}
            style={{
              ...buttonStyle,
              borderRadius: '2px',
              ...(isDeep ? { '--decay-shake': '1px' } as React.CSSProperties : {}),
              ...(isDeep ? { transform: `rotate(${frequencyLevel < 0.1 ? '-2deg' : '-1deg'})` } : {}),
            }}
          >
            + ESTABLISH LINK
          </button>
        </div>

        {/* ── History / Contact Log ── */}
        <div
          className={`border-2 flex-1 flex flex-col overflow-hidden p-3 ${isDark ? 'bg-black/60 border-gray-700' : 'bg-card border-border'}`}
          style={{ borderRadius: '4px', boxShadow: '4px 4px 0 #0f0f0f' }}
        >
          <div className={`text-[10px] font-mono uppercase tracking-[0.25em] text-center pb-2 border-b mb-2 opacity-60 ${isDark ? 'border-gray-700' : 'border-border'}`}>
            Contact Log
          </div>
          <HistoryBar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={handleSelectConversation}
            onDelete={deleteConversation}
            frequencyLevel={frequencyLevel}
          />
        </div>
      </aside>

      {/* ═══════════════ MAIN CHAT ═══════════════ */}
      <main
        className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden border-2 bg-grid ${isDark ? 'border-gray-700 bg-black/40' : 'border-border bg-card'} ${isExtreme ? 'meti-flickering' : ''}`}
        style={{ borderRadius: '4px', boxShadow: '4px 4px 0 #0f0f0f' }}
      >
        {activeConversationId && activeConversation ? (
          <ChatWindow
            key={activeConversationId}
            entityId={activeConversation.entityId}
            frequencyMhz={activeConversation.frequencyMhz}
            messages={activeConversation.messages}
            setMessages={setCurrentMessages}
            frequencyLevel={frequencyLevel}
            currentFrequency={frequency}
            onReTune={handleReTune}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <div
              className={`text-6xl mb-8 opacity-20 font-brand tracking-widest ${isDeep ? 'meti-glitch-text' : ''}`}
              style={{ fontFamily: 'Unica One, sans-serif' }}
            >
              METI FM
            </div>
            <div className="mb-10 max-w-sm">
              <h1 className="font-display text-3xl mb-3 font-bold tracking-tight">
                {isDark ? 'YOU SHOULD NOT BE HERE' : 'TUNE IN'}
              </h1>
              <p className={`font-mono text-xs leading-relaxed opacity-60 ${isDark ? 'text-red-300' : ''}`}>
                {isDark
                  ? 'This frequency range has not been cleared for civilian contact. Proceed at your own discretion. AIRA has been notified.'
                  : 'Drag the dial to select a frequency. Each frequency carries a different consciousness. Establish a link to begin transmission.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 text-left w-full max-w-sm">
              {[
                { step: '01', label: 'Tune the frequency dial', safe: true },
                { step: '02', label: 'Hit + ESTABLISH LINK',    safe: true },
                { step: '03', label: 'Transmit your signal',    safe: true },
                { step: '⚠',  label: 'Avoid below 200 MHz',    safe: false },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`flex items-center gap-3 border-2 p-3 ${item.safe ? isDark ? 'bg-black/40 border-gray-700' : 'bg-background border-border' : 'bg-amber-950/30 border-amber-800/50'}`}
                  style={{ borderRadius: '3px' }}
                >
                  <div
                    className={`w-7 h-7 border-2 border-border flex items-center justify-center text-xs font-bold font-mono shrink-0 ${item.safe ? 'bg-card' : 'bg-amber-900/50 border-amber-700 text-amber-400'}`}
                    style={{ borderRadius: '2px' }}
                  >
                    {item.step}
                  </div>
                  <span className={`font-mono text-xs font-bold ${item.safe ? '' : 'text-amber-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── AIRA Guide Bot ── */}
      <AiraBot frequency={frequency} frequencyLevel={frequencyLevel} />

      {/* ── Settings Modal ── */}
      <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;