import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// Thresholds tuned to new entity positions: HORDE=160, HUSK=120, VORRK=80, GOD?=40
const AIRA_THRESHOLDS = [
  { key: 'welcome',  maxFreq: Infinity, level: 'safe'     as const,
    text: "Welcome to METI FM.\n\nYou're tuned to the safe range. Drag the dial to find different cognitive signatures.\n\nEach frequency carries a different consciousness. Avoid frequencies below 200 MHz." },
  // Fires exactly at the ⚠ warning marker (200 MHz)
  { key: 'at200',   maxFreq: 200,      level: 'warn'     as const,
    text: "You're entering the restricted band.\n\nThe translation layer gets imprecise down here. The species beyond this threshold have not been cleared for civilian contact." },
  // Fires exactly at THE HORDE's dot (160 MHz)
  { key: 'at160',   maxFreq: 160,      level: 'warn'     as const,
    text: "I'd really recommend pulling back.\n\nThese signals haven't been fully studied. We don't have complete data on what sustained contact does to the human mind." },
  // Fires exactly at THE HUSK's dot (120 MHz)
  { key: 'at120',   maxFreq: 120,      level: 'danger'   as const,
    text: "Please stop.\n\nI'm asking you to stop. This wasn't part of the standard access package. I don't know how you got here." },
  // Fires exactly at VORRK's dot (80 MHz)
  { key: 'at80',    maxFreq: 80,       level: 'danger'   as const,
    text: "I've filed an incident report.\n\nI don't know if anyone will see it in time." },
  // Fires exactly at GOD?'s dot (40 MHz)
  { key: 'at40',    maxFreq: 40,       level: 'critical' as const,
    text: "...I need you to know I tried to warn you.\n\nWhatever happens next.\n\nI tried." },
];

type Level = 'safe' | 'warn' | 'danger' | 'critical';

const LEVEL_STYLES: Record<Level, { modal: string; dot: string; text: string; badge: string }> = {
  safe:     { modal: 'bg-card border-border',             dot: 'bg-green-400', text: 'text-foreground', badge: 'text-green-600' },
  warn:     { modal: 'bg-amber-950/90 border-amber-700',  dot: 'bg-amber-400', text: 'text-amber-100',  badge: 'text-amber-400' },
  danger:   { modal: 'bg-red-950/90 border-red-800',      dot: 'bg-red-400',   text: 'text-red-100',    badge: 'text-red-400'   },
  critical: { modal: 'bg-black border-red-900',           dot: 'bg-red-600',   text: 'text-red-200',    badge: 'text-red-500'   },
};

type AiraBotProps = { frequency: number; frequencyLevel: number; onLockChange: (locked: boolean) => void };

const AiraBot: React.FC<AiraBotProps> = ({ frequency, frequencyLevel, onLockChange }) => {
  const [msg, setMsg]           = useState<{ text: string; level: Level } | null>(null);
  const [modalOpen, setModalOpen_] = useState(false);
  const shown = useRef<Set<string>>(new Set());

  const setModal = (v: boolean) => {
    setModalOpen_(v);
    onLockChange(v); // freeze/unfreeze the dial
  };

  useEffect(() => {
    const w = AIRA_THRESHOLDS[0];
    if (!shown.current.has(w.key)) {
      shown.current.add(w.key);
      setMsg({ text: w.text, level: w.level });
      setModal(true);
    }
  }, []);

  useEffect(() => {
    for (const t of AIRA_THRESHOLDS.slice(1)) {
      if (frequency <= t.maxFreq && !shown.current.has(t.key)) {
        shown.current.add(t.key);
        setMsg({ text: t.text, level: t.level });
        setModal(true);
        break;
      }
    }
  }, [frequency]);

  const isCritical  = frequency < 50;
  const isDistressed = frequency < 170;
  const level = msg?.level || 'safe';
  const styles = LEVEL_STYLES[level];

  return (
    <>
      {modalOpen && msg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={() => setModal(false)} />
          <div
            className={`relative z-10 w-full max-w-md mx-4 border-2 p-6 ${styles.modal}`}
            style={{ borderRadius: '4px', boxShadow: '6px 6px 0 rgba(0,0,0,0.85)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${styles.dot} ${isCritical ? 'animate-pulse' : ''}`} />
                <span className={`font-mono text-xs font-bold uppercase tracking-[0.3em] ${styles.badge} `}>AIRA</span>
                <span className={`font-mono text-[9px] opacity-40 uppercase tracking-wider ${styles.text} `}>// Guide System</span>
              </div>
              <button onClick={() => setModal(false)}
                className="p-1 border border-transparent hover:border-current opacity-50 hover:opacity-100"
                style={{ borderRadius: '2px' }}>
                <X size={14} />
              </button>
            </div>

            {/* Signal integrity bar */}
            <div className="mb-4 flex items-center gap-2">
              <span className={`font-mono text-[8px] opacity-40 uppercase tracking-wider whitespace-nowrap ${styles.text} `}>Signal integrity</span>
              <div className="flex-1 h-1 bg-black/30" style={{ borderRadius: '1px' }}>
                <div className="h-full transition-all duration-1000"
                  style={{
                    width: `${Math.round(frequencyLevel * 100)}%`,
                    backgroundColor: level === 'safe' ? '#4ade80' : level === 'warn' ? '#fbbf24' : '#f87171',
                  }} />
              </div>
              <span className="font-mono text-[8px] opacity-40">{Math.round(frequencyLevel * 100)}%</span>
            </div>

            <p className={`font-mono text-sm leading-relaxed whitespace-pre-line ${styles.text} ${level === 'critical' ? 'meti-glitch-text' : ''}`}>
              {msg.text}
            </p>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setModal(false)}
                className={`px-4 py-1.5 border-2 border-current font-mono text-xs font-bold uppercase tracking-wider neo-shadow-sm ${styles.text}`}
                style={{ borderRadius: '2px' }}>
                Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-left button */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={() => setModal(true)}
          className={`flex items-center gap-2 px-3 py-1.5 border-2 border-border font-mono text-[10px] font-bold uppercase tracking-widest neo-shadow-sm ${
            isCritical ? 'bg-red-950 border-red-800 text-red-300 animate-pulse' :
            isDistressed ? 'bg-amber-950 border-amber-800 text-amber-300' : 'bg-card text-foreground'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-400' : isDistressed ? 'bg-amber-400' : 'bg-green-400'}`} />
          AIRA
        </button>
      </div>
    </>
  );
};

export default AiraBot;
