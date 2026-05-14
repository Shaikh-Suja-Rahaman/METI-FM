import { useEffect, useMemo, useState } from 'react';
import { Settings, Info, RotateCcw } from 'lucide-react';
import FrequencyDial from '../components/FrequencyDial';
import ChatWindow from '../components/ChatWindow';
import HistoryBar, { type ConversationShape } from '../components/HistoryBar';
import AiraBot from '../components/AriaBot';
import DecayOverlay from '../components/DecayOverlay';
import SettingsModal from '../components/settingsModal';
import InfoModal from '../components/InfoModal';
import ConfirmModal from '../components/ConfirmModal';
import { getFrequencyLevel, getNearestEntity, DARK_THRESHOLD, FREQ_MIN } from '../entities';

export type Message = { role: string; message: string };

const deriveTitle = (messages: Message[]): string => {
  const u = messages.find(m => m.role === 'user');
  if (!u) return 'New Link';
  return u.message.trim().length > 36 ? u.message.trim().slice(0, 34) + '…' : u.message.trim();
};

const computeDecayVars = (frequencyLevel: number) => {
  const t = Math.max(0, Math.min(1, 1 - frequencyLevel / 0.222));
  const bgHue = 43 - t * 40, bgSat = Math.max(2, 33 - t * 30), bgLight = Math.max(8, 91 - t * 80);
  const cardHue = 48 - t * 40, cardSat = Math.max(1, 30 - t * 28), cardLight = Math.max(10, 95 - t * 82);
  return {
    '--freq-level': frequencyLevel,
    '--decay-bg-hue': `${bgHue}`, '--decay-bg-sat': `${bgSat}%`, '--decay-bg-light': `${bgLight}%`,
    '--decay-crack-opacity': Math.max(0, Math.min(1, (t - 0.3) / 0.6)),
    '--decay-vine-size': `${Math.max(0, (t - 0.35) * 250)}px`,
    '--decay-shake': `${Math.max(0, (t - 0.55) * 6)}px`,
    '--decay-tilt': `${Math.max(0, (t - 0.65) * 6)}deg`,
    '--decay-grid-opacity': Math.max(0.02, 0.06 - t * 0.04),
    '--decay-glitch-speed': t > 0.6 ? `${Math.max(1.5, 4 - t * 4)}s` : '0s',
    '--background': `${bgHue} ${bgSat}% ${bgLight}%`,
    '--card': `${cardHue} ${cardSat}% ${cardLight}%`,
  };
};

const Layout = () => {
  const [frequency, setFrequency] = useState<number>(847.3);
  const frequencyLevel = useMemo(() => getFrequencyLevel(frequency), [frequency]);
  const decayVars = useMemo(() => computeDecayVars(frequencyLevel), [frequencyLevel]);

  const isDark    = frequency < DARK_THRESHOLD;
  const isDeep    = frequency < 100;
  const isExtreme = frequency < 50;

  // ── Revealed entities ──
  const [revealedEntities, setRevealedEntities] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem('meti-revealed-entities'); return s ? new Set(JSON.parse(s)) : new Set<string>(); }
    catch { return new Set<string>(); }
  });
  const [newlyRevealedCount, setNewlyRevealedCount] = useState(0);
  const [infoNewBadge, setInfoNewBadge] = useState(false);

  useEffect(() => {
    localStorage.setItem('meti-revealed-entities', JSON.stringify([...revealedEntities]));
  }, [revealedEntities]);

  // ── Conversations ──
  const [conversations, setConversations] = useState<ConversationShape[]>(() => {
    try { return JSON.parse(localStorage.getItem('meti-conversations') || '[]'); }
    catch { localStorage.removeItem('meti-conversations'); return []; }
  });
  useEffect(() => { localStorage.setItem('meti-conversations', JSON.stringify(conversations)); }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDialLocked, setIsDialLocked] = useState(false);
  const [airaResetKey, setAiraResetKey] = useState(0);

  const handleReset = () => {
    localStorage.removeItem('meti-conversations');
    localStorage.removeItem('meti-revealed-entities');
    localStorage.removeItem('meti-aira-shown');
    setConversations([]);
    setRevealedEntities(new Set());
    setActiveConversationId(null);
    setFrequency(847.3);
    setInfoNewBadge(false);
    setIsResetOpen(false);
    setAiraResetKey(k => k + 1);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const c = conversations.find(x => x.id === id);
    if (c) {
      // GOD? goes to the absolute minimum of the dial
      setFrequency(c.entityId === 'theSignal' ? FREQ_MIN : c.frequencyMhz);
    }
  };

  const establishLink = () => {
    const entity = getNearestEntity(frequency);
    if (entity.side === 'dark' && !revealedEntities.has(entity.id)) {
      setRevealedEntities(prev => new Set([...prev, entity.id]));
      setInfoNewBadge(true);
    }
    const newConvo: ConversationShape = {
      id: Date.now().toString(), entityId: entity.id,
      // Store actual dial position so history restores exactly where you were
      frequencyMhz: frequency, title: 'New Link',
      createdAt: Date.now(), messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConversationId(newConvo.id);
    // Do NOT auto-tune — that would trigger AIRA thresholds unexpectedly.
    // Dial stays wherever the user left it.
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) setActiveConversationId(null);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const setCurrentMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setConversations(prev => prev.map(convo => {
      if (convo.id !== activeConversationId) return convo;
      const msgs = typeof updater === 'function' ? updater(convo.messages) : updater;
      return { ...convo, messages: msgs, title: convo.title === 'New Link' ? deriveTitle(msgs) : convo.title };
    }));
  };

  const handleReTune = () => {
    if (activeConversation) setFrequency(activeConversation.frequencyMhz);
  };

  const nearestEntity = useMemo(() => getNearestEntity(frequency), [frequency]);
  const buttonStyle = isDark
    ? { backgroundColor: '#1a0a0a', borderColor: '#5a1a1a', color: '#cc4444' }
    : { backgroundColor: nearestEntity.hexColor, borderColor: '#0f0f0f', color: nearestEntity.side === 'light' ? '#0f0f0f' : '#f0ece0' };

  return (
    <div
      className="h-screen w-full flex text-foreground p-4 gap-4 overflow-hidden relative crack-overlay"
      style={{
        ...(decayVars as React.CSSProperties),
        background: `hsl(${decayVars['--decay-bg-hue']} ${decayVars['--decay-bg-sat']} ${decayVars['--decay-bg-light']})`,
      }}
    >
      <DecayOverlay frequencyLevel={frequencyLevel} frequency={frequency} />

      {/* ═══════ SIDEBAR ═══════ */}
      <aside className={`w-[285px] flex-shrink-0 flex flex-col gap-3 ${isExtreme ? 'meti-shaking' : ''}`}>
        {/* Brand panel */}
        <div
          className={`border-2 p-4 flex flex-col gap-3 relative ${isDark ? 'bg-black/70 border-gray-700' : 'bg-card border-border'}`}
          style={{ borderRadius: '4px', boxShadow: '4px 4px 0 #0f0f0f' }}
        >
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
            {/* Reset button */}
            <button
              className="p-1.5 border border-transparent hover:border-border hover:bg-muted/50 transition-colors rounded-sm"
              onClick={() => setIsResetOpen(true)}
              title="Reset contact log"
            >
              <RotateCcw size={13} />
            </button>
            {/* Info button with notification badge */}
            <div className="relative">
              <button
                className="p-1.5 border border-transparent hover:border-border hover:bg-muted/50 transition-colors rounded-sm"
                onClick={() => { setIsInfoOpen(true); setInfoNewBadge(false); }}
                title="How METI FM works"
              >
                <Info size={15} />
              </button>
              {infoNewBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <button
              className="p-1.5 border border-transparent hover:border-border hover:bg-muted/50 transition-colors rounded-sm"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              <Settings size={15} />
            </button>
          </div>

          {/* Brand — black text, no opacity fade */}
          <div className="pr-16">
            <div className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Unica One, sans-serif' }}>
              METI FM
            </div>
            <div className={`text-[9px] font-mono uppercase tracking-[0.25em] opacity-60 ${isDeep ? 'meti-glitch-text' : ''}`}>
              Messaging Extraterrestrial Intelligence
            </div>
          </div>

          {/* Frequency readout — shows entity displayFreq, consistent with dial labels */}
          <div
            className={`border border-border/40 px-2 py-1.5 flex items-center gap-2 justify-center ${isDark ? 'bg-black/50 border-gray-700' : 'bg-background/50'}`}
            style={{ borderRadius: '2px' }}
          >
            <span className={`font-mono text-base font-bold tracking-widest ${isDeep ? 'text-red-400' : isDark ? 'text-amber-400' : 'text-foreground'}`}>
              {nearestEntity.displayFreq}
            </span>
            <span
              className="ml-1 px-1.5 py-0.5 text-[8px] font-bold uppercase"
              style={{ backgroundColor: nearestEntity.hexColor, color: nearestEntity.side === 'light' ? '#0f0f0f' : '#f0ece0', borderRadius: '2px' }}
            >
              {(nearestEntity.revealedByDefault || revealedEntities.has(nearestEntity.id)) ? nearestEntity.name : '???'}
            </span>
          </div>

          <FrequencyDial frequency={frequency} onChange={setFrequency} revealedEntities={revealedEntities} locked={isDialLocked} />

          <button
            onClick={establishLink}
            className={`h-10 flex items-center justify-center font-bold uppercase tracking-widest border-2 text-sm neo-shadow-sm ${isDeep ? 'meti-shaking' : ''}`}
            style={{
              ...buttonStyle, borderRadius: '2px',
              ...(isDeep ? { transform: `rotate(${frequencyLevel < 0.1 ? '-2deg' : '-1deg'})` } : {}),
            }}
          >
            + ESTABLISH LINK
          </button>
        </div>

        {/* Contact Log */}
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

      {/* ═══════ MAIN ═══════ */}
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
          /* Empty state — no TUNE IN heading */
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <div
              className={`text-7xl mb-10 font-bold tracking-tight text-foreground ${isDeep ? 'meti-glitch-text' : ''}`}
              style={{ fontFamily: 'Unica One, sans-serif' }}
            >
              METI FM
            </div>
            <div className="flex flex-col gap-3 text-left w-full max-w-sm">
              {[
                { step: '01', label: 'Tune the frequency dial',  warn: false },
                { step: '02', label: 'Hit + ESTABLISH LINK',     warn: false },
                { step: '03', label: 'Transmit your signal',     warn: false },
                { step: '⚠',  label: 'Avoid below 6.6×10³⁵ Hz',     warn: true  },
              ].map(item => (
                <div
                  key={item.step}
                  className={`flex items-center gap-3 border-2 p-3 ${item.warn ? 'bg-card border-red-700' : isDark ? 'bg-black/40 border-gray-700' : 'bg-background border-border'}`}
                  style={{ borderRadius: '3px' }}
                >
                  <div
                    className={`w-7 h-7 border-2 flex items-center justify-center text-xs font-bold font-mono shrink-0 ${item.warn ? 'bg-red-900/40 border-red-700 text-red-400' : 'bg-card border-border'}`}
                    style={{ borderRadius: '2px' }}
                  >
                    {item.warn ? '' : item.step}
                  </div>
                  <span className={`font-mono text-xs font-bold ${item.warn ? 'text-red-400' : ''}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AiraBot frequency={frequency} frequencyLevel={frequencyLevel} onLockChange={setIsDialLocked} resetKey={airaResetKey} />
      <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <InfoModal
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        revealedEntities={revealedEntities}
        hasNew={infoNewBadge}
        onAcknowledgeNew={() => setInfoNewBadge(false)}
      />
      <ConfirmModal
        open={isResetOpen}
        title="Reset all contacts?"
        message={"This will clear your contact log and hide all unlocked entities back to ???\nYour message allowance is not affected."}
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setIsResetOpen(false)}
      />
    </div>
  );
};

export default Layout;