import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import ConfirmModal from './ConfirmModal';
import { ENTITY_MAP } from '../entities';

export type ConversationShape = {
  id: string;
  entityId: string;
  frequencyMhz: number;
  title: string;
  createdAt: number;
  messages: { role: string; message: string }[];
};

type HistoryBarProps = {
  conversations: ConversationShape[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;   // also tunes the dial
  onDelete: (id: string) => void;
  frequencyLevel: number;
};

const HistoryBar: React.FC<HistoryBarProps> = ({
  conversations, activeConversationId, onSelect, onDelete, frequencyLevel,
}) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="text-[11px] font-mono text-center opacity-40 uppercase tracking-widest leading-relaxed">
          No links established.<br />Tune the dial and<br />make contact.
        </div>
      </div>
    );
  }

  const pending = conversations.find(c => c.id === pendingDeleteId);

  return (
    <>
      <ScrollArea className="flex-1 w-full mt-1 pr-1">
        <div className="flex flex-col gap-2 pb-4 px-1 pt-1">
          {[...conversations].reverse().map((convo) => {
            const entity   = ENTITY_MAP[convo.entityId];
            const isActive = convo.id === activeConversationId;
            const isDark   = entity?.side === 'dark';

            // Always use real entity hex — not affected by frequency decay
            const tagBg    = entity?.hexColor  || '#888888';
            const tagColor = entity?.side === 'light' ? '#0f0f0f' : '#f0ece0';

            const isDecayed = frequencyLevel < 0.222; // in the dark zone

            return (
              <div
                key={convo.id}
                role="button"
                tabIndex={0}
                className={`group relative p-2.5 mr-1 border-2 flex flex-col gap-1.5 cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'translate-x-[3px] translate-y-[3px] shadow-none'
                    : 'hover:brightness-95'
                }`}
                style={{
                  borderRadius: '3px',
                  boxShadow: isActive ? 'none' : '3px 3px 0 hsl(var(--border))',
                  // Dark entity cards: always dark. Light entity cards: cream in dark mode so they stay readable
                  backgroundColor: isDark ? '#1a1a1a' : isDecayed ? '#f0ece0' : 'hsl(var(--card))',
                  borderColor: isDark ? '#3a3a3a' : isDecayed ? '#c0b89a' : 'hsl(var(--border))',
                }}
                onClick={() => onSelect(convo.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(convo.id)}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="font-mono text-[11px] leading-tight line-clamp-2 flex-1"
                    style={{ color: isDark ? '#e8e0d0' : '#1a1a1a' }}>
                    {convo.title}
                  </div>
                  <button
                    className="shrink-0 w-5 h-5 flex items-center justify-center border border-transparent opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all"
                    style={{ borderRadius: '2px' }}
                    onClick={(e) => { e.stopPropagation(); setPendingDeleteId(convo.id); }}
                    aria-label="Delete link"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Entity tag — always true color */}
                  <span
                    className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: tagBg, color: tagColor, borderRadius: '2px' }}
                  >
                    {entity?.name || convo.entityId}
                  </span>
                  <span className="text-[9px] font-mono opacity-40" style={{ color: isDark ? '#888' : undefined }}>
                    {convo.frequencyMhz.toFixed(1)} MHz
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <ConfirmModal
        title="Sever this link?"
        message={`"${pending?.title || 'This contact'}" will be erased. The signal will not remember.`}
        confirmLabel="Sever"
        onConfirm={() => { if (pendingDeleteId) { onDelete(pendingDeleteId); setPendingDeleteId(null); } }}
        onCancel={() => setPendingDeleteId(null)}
        open={!!pendingDeleteId}
      />
    </>
  );
};

export default HistoryBar;