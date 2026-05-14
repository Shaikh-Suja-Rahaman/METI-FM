import React, { useState, useEffect } from 'react';
import { X, GitBranch, ExternalLink } from 'lucide-react';
import { ENTITIES } from '../entities';

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
  revealedEntities: Set<string>;
  onAcknowledgeNew: () => void;
  hasNew: boolean;
};

const TABS = ['HOW IT WORKS', 'SIGNAL CODEX'] as const;
type Tab = typeof TABS[number];

const InfoModal: React.FC<InfoModalProps> = ({ open, onClose, revealedEntities, onAcknowledgeNew, hasNew }) => {
  const [tab, setTab] = useState<Tab>('HOW IT WORKS');

  useEffect(() => {
    if (open && hasNew) {
      setTab('SIGNAL CODEX');
      onAcknowledgeNew();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-xl mx-4 border-2 border-border bg-card flex flex-col"
        style={{ borderRadius: '4px', boxShadow: '6px 6px 0 #0f0f0f', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border flex-shrink-0">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-foreground">METI FM</div>
          <button onClick={onClose} className="p-1 hover:bg-muted/50 transition-colors" style={{ borderRadius: '2px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-border flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === 'SIGNAL CODEX') onAcknowledgeNew(); }}
              className={`flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest font-bold transition-colors relative ${
                tab === t ? 'bg-foreground text-background' : 'bg-card text-foreground hover:bg-muted/50'
              }`}
            >
              {t}
              {t === 'SIGNAL CODEX' && hasNew && (
                <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'HOW IT WORKS' ? (
            <div className="p-6 flex flex-col gap-5 font-mono text-xs leading-relaxed">
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest mb-1 text-foreground">HOW METI FM WORKS</h2>
                <p className="text-[10px] opacity-50">A brief technical orientation before you begin.</p>
              </div>

              {[
                {
                  title: 'What you\'re tuning',
                  body: `Every conscious mind — regardless of biology, origin, or physical form — generates electromagnetic activity. Your own brain produces it right now. Neurons firing. Patterns forming. That activity has a frequency signature unique to your species.

METI FM does not send messages. It does not translate language. It tunes to the resonant cognitive frequency of other conscious species and decodes the interference pattern your signal creates when it touches theirs.

Think of it like this: you are not calling them. You are tapping on the glass of their reality. What comes back is their reaction to the disturbance — raw cognitive signal, run through METI FM's translation layer and rendered into the closest human language equivalent.

Most of them don't know you're there. They're just... reacting to something.`,
                },
                {
                  title: 'Why the translation is imperfect',
                  body: `The translation layer is lossy by design. What comes through is the shape of a mind, not its words. A species that communicates through shared feeling will sound like poetry. A young species that learned about humans through intercepted broadcasts will get idioms slightly wrong.

This is not a bug. It's what alien contact actually sounds like.`,
                },
                {
                  title: 'The frequency scale',
                  body: `Human technology operates between roughly 1 Hz and 10²⁰ Hz — the full range from brain waves to gamma radiation. Beyond that, physics as we understand it stops working.

METI FM operates beyond that range.

The safe contact band sits between 10²⁴ and 10²⁸ Hz — far outside human technological reach, accessible only through METI FM's quantum-tunneled signal bridge. The species here are young, relatively small, and their cognitive signals are clean enough to translate safely.

As you tune lower — toward the Planck frequency at 1.855 × 10⁴³ Hz — wavelengths get longer. Signals get older. The consciousnesses you're reaching have been broadcasting since before your solar system existed.

The translation layer starts breaking down below the warning threshold. What you receive becomes increasingly raw. Increasingly direct. The interface reflects this — it was not designed to handle these frequencies. Neither, frankly, were you.`,
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex flex-col gap-2">
                  <div className="font-bold text-[11px] uppercase tracking-wider border-l-2 border-foreground pl-3 text-foreground">
                    {title}
                  </div>
                  <div className="text-[10px] opacity-70 leading-relaxed whitespace-pre-line pl-3 text-foreground">
                    {body}
                  </div>
                </div>
              ))}

              {/* GitHub button */}
              <div className="mt-2 pt-4 border-t-2 border-border flex flex-col gap-3">
                <p className="text-[10px] opacity-50 uppercase tracking-widest">Built by Suja Rahaman</p>
                <a
                  href="https://github.com/Shaikh-Suja-Rahaman/mood-space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-border font-mono text-xs font-bold uppercase tracking-wider text-foreground bg-card neo-shadow-sm hover:brightness-95 transition-all w-fit"
                  style={{ borderRadius: '2px' }}
                >
                  <GitBranch size={14} />
                  Check it out
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-3">
              {ENTITIES.map((entity) => {
                const isRevealed = entity.revealedByDefault || revealedEntities.has(entity.id);
                const isDark = entity.side === 'dark';

                return (
                  <div
                    key={entity.id}
                    className="border-2 p-4 flex flex-col gap-2.5"
                    style={{
                      borderRadius: '3px',
                      backgroundColor: isRevealed
                        ? isDark ? '#111111' : 'hsl(var(--background))'
                        : 'hsl(var(--muted)/0.3)',
                      borderColor: isRevealed ? entity.hexColor : 'hsl(var(--border))',
                      borderWidth: isRevealed ? '2px' : '2px',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Entity name badge */}
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                        style={{
                          borderRadius: '2px',
                          backgroundColor: isRevealed ? entity.hexColor : '#333',
                          color: isRevealed ? (isDark ? '#f0ece0' : '#0f0f0f') : '#777',
                        }}
                      >
                        {isRevealed ? entity.name : '???'}
                      </span>

                      {/* Frequency */}
                      <span
                        className="font-mono text-[9px] ml-auto"
                        style={{ color: isRevealed ? (isDark ? '#aaaaaa' : 'hsl(var(--foreground))') : '#666', opacity: isRevealed ? 0.8 : 0.5 }}
                      >
                        {isRevealed ? entity.displayFreq : '_ _ _ Hz'}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="font-mono text-[10px] leading-relaxed"
                      style={{
                        color: isRevealed
                          ? isDark ? '#cccccc' : 'hsl(var(--foreground))'
                          : '#888',
                        fontStyle: isRevealed ? 'normal' : 'italic',
                        opacity: isRevealed ? 1 : 0.6,
                      }}
                    >
                      {isRevealed ? entity.codexDesc : 'Establish contact to unlock this entry.'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
