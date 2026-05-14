import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const AIRA_THRESHOLDS = [
  {
    key: 'welcome',
    maxFreq: Infinity,
    text: "Welcome to METI FM. You're currently tuned to the safe range. Scroll the dial to find different cognitive signatures. Each frequency carries a different consciousness. Please avoid frequencies below 200MHz.",
    level: 'safe' as const,
  },
  {
    key: 'below200',
    maxFreq: 199.9,
    text: "Just a heads up — you're entering a less catalogued range. The translation layer gets imprecise down here. Totally your call though.",
    level: 'warn' as const,
  },
  {
    key: 'below100',
    maxFreq: 99.9,
    text: "I'd really recommend pulling back. These signals haven't been fully studied. We don't have complete data on what sustained contact does.",
    level: 'danger' as const,
  },
  {
    key: 'below50',
    maxFreq: 49.9,
    text: "Please stop. I'm asking you to stop. This wasn't part of the standard access package. I don't know how you got here.",
    level: 'critical' as const,
  },
  {
    key: 'atSignal',
    maxFreq: 0.15,
    text: "...I need you to know I tried to warn you. Whatever happens next. I tried.",
    level: 'critical' as const,
  },
];

type Level = 'safe' | 'warn' | 'danger' | 'critical';

const LEVEL_STYLES: Record<Level, { modal: string; dot: string; text: string; badge: string }> = {
  safe:     { modal: 'bg-card border-border',                dot: 'bg-green-400',  text: 'text-foreground',   badge: 'text-green-600' },
  warn:     { modal: 'bg-amber-950/90 border-amber-700',     dot: 'bg-amber-400',  text: 'text-amber-100',    badge: 'text-amber-400' },
  danger:   { modal: 'bg-red-950/90 border-red-800',         dot: 'bg-red-400',    text: 'text-red-100',      badge: 'text-red-400'   },
  critical: { modal: 'bg-black border-red-900',              dot: 'bg-red-600',    text: 'text-red-200',      badge: 'text-red-500'   },
};

type AiraBotProps = {
  frequency: number;
  frequencyLevel: number;
};

const AiraBot: React.FC<AiraBotProps> = ({ frequency, frequencyLevel }) => {
  const [currentMsg, setCurrentMsg] = useState<{ text: string; level: Level } | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const shown = useRef<Set<string>>(new Set());

  // Show welcome on mount
  useEffect(() => {
    const w = AIRA_THRESHOLDS[0];
    if (!shown.current.has(w.key)) {
      shown.current.add(w.key);
      setCurrentMsg({ text: w.text, level: w.level });
      setModalOpen(true);
    }
  }, []);

  // Trigger on frequency crossing a threshold
  useEffect(() => {
    for (const t of AIRA_THRESHOLDS.slice(1)) {
      if (frequency <= t.maxFreq && !shown.current.has(t.key)) {
        shown.current.add(t.key);
        setCurrentMsg({ text: t.text, level: t.level });
        setModalOpen(true);
        break;
      }
    }
  }, [frequency]);

  const isCritical = frequency < 50;
  const isDistressed = frequency < 100;

  const level: Level = currentMsg?.level || 'safe';
  const styles = LEVEL_STYLES[level];

  return (
    <>
      {/* ── Full-screen modal popup ── */}
      {modalOpen && currentMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal card */}
          <div
            className={`relative z-10 w-full max-w-md mx-4 border-2 p-6 ${styles.modal}`}
            style={{
              borderRadius: '4px',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.8)',
              animation: level === 'critical' ? 'meti-shake 0.5s ease-in-out 2' : undefined,
              '--decay-shake': '2px',
              '--decay-tilt': '0deg',
            } as React.CSSProperties}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${styles.dot} ${isCritical ? 'animate-pulse' : ''}`}
                  style={{ boxShadow: `0 0 6px currentColor` }}
                />
                <span className={`font-mono text-xs font-bold uppercase tracking-[0.3em] ${styles.badge}`}>
                  AIRA
                </span>
                <span className="font-mono text-[9px] opacity-40 uppercase tracking-wider">
                  // Guide System
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 border border-transparent hover:border-current opacity-50 hover:opacity-100 transition-all"
                style={{ borderRadius: '2px' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Signal integrity bar */}
            <div className="mb-4 flex items-center gap-2">
              <span className="font-mono text-[8px] opacity-40 uppercase tracking-wider whitespace-nowrap">
                Signal integrity
              </span>
              <div className="flex-1 h-1 bg-black/30 overflow-hidden" style={{ borderRadius: '1px' }}>
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${Math.round(frequencyLevel * 100)}%`,
                    backgroundColor: level === 'safe' ? '#4ade80' : level === 'warn' ? '#fbbf24' : '#f87171',
                  }}
                />
              </div>
              <span className="font-mono text-[8px] opacity-40">{Math.round(frequencyLevel * 100)}%</span>
            </div>

            {/* Message */}
            <p className={`font-mono text-sm leading-relaxed ${styles.text} ${level === 'critical' ? 'meti-glitch-text' : ''}`}>
              {currentMsg.text}
            </p>

            {/* Footer */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className={`px-4 py-1.5 border-2 border-current font-mono text-xs font-bold uppercase tracking-wider neo-shadow-sm ${styles.text}`}
                style={{ borderRadius: '2px' }}
              >
                Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Persistent bottom-left indicator button ── */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={() => setModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 border-2 border-border font-mono text-[10px] font-bold uppercase tracking-widest neo-shadow-sm transition-all ${
            isCritical ? 'bg-red-950 border-red-800 text-red-300 animate-pulse' :
            isDistressed ? 'bg-amber-950 border-amber-800 text-amber-300' :
            'bg-card text-foreground'
          }`}
          style={{ borderRadius: '2px' }}
          title="Open AIRA guidance"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            isCritical ? 'bg-red-400 animate-pulse' :
            isDistressed ? 'bg-amber-400' : 'bg-green-400'
          }`} />
          AIRA
        </button>
      </div>
    </>
  );
};

export default AiraBot;
