import React, { useState } from 'react'
import type { Conversation } from '../pages/Layout'
import ConfirmModal from './ConfirmModal'
import { X } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'

type HistoryBarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  onDelete: (id: string) => void;
}

const personaLabels: Record<string, string> = {
  chillFriend: "Chill Friend",
  gentleListener: "Gentle Listener",
  harshCoach: "Harsh Coach",
};

const personaColors: Record<string, string> = {
  chillFriend: "bg-vibeSky text-vibeSky-foreground",
  gentleListener: "bg-vibeMint text-vibeMint-foreground",
  harshCoach: "bg-vibeCoral text-vibeCoral-foreground",
};

const HistoryBar = ({
  conversations,
  activeConversationId,
  setActiveConversationId,
  onDelete,
}: HistoryBarProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // don't select the chat
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const pendingConvo = conversations.find(c => c.id === pendingDeleteId);

  return (
    <>
      {conversations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center pb-8">
          <div className="text-sm font-medium text-muted-foreground">No chats yet</div>
        </div>
      ) : (
        <ScrollArea className="flex-1 w-full mt-4 pr-3">
          <div className="flex flex-col gap-3 pb-4 px-2 pt-2">
            {[...conversations].reverse().map((convo) => {
              const isActive = convo.id === activeConversationId;
              return (
                <div
                  key={convo.id}
                  role="button"
                  tabIndex={0}
                  className={`group relative p-3 mr-1 mb-1 mt-1 rounded-lg border-2 border-border flex flex-col gap-2 cursor-pointer transition-all duration-200 ease-in-out
                    ${isActive ? 'bg-secondary translate-x-[3px] translate-y-[3px] shadow-none' : 'neo-shadow-sm bg-card hover:bg-muted/50'}
                  `}
                  onClick={() => setActiveConversationId(convo.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveConversationId(convo.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm leading-tight text-foreground line-clamp-2">
                      {convo.title}
                    </div>
                    <button
                      className="shrink-0 w-6 h-6 rounded-md border-2 border-transparent bg-transparent flex items-center justify-center text-foreground opacity-0 transition-all hover:bg-destructive hover:border-border hover:text-destructive-foreground focus:opacity-100 group-hover:opacity-100"
                      title="Delete chat"
                      onClick={(e) => handleDeleteClick(e, convo.id)}
                      aria-label="Delete conversation"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 border-border ${personaColors[convo.persona] || 'bg-accent text-accent-foreground'}`}>
                      {personaLabels[convo.persona] || convo.persona}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <ConfirmModal
        title="Delete this chat?"
        message={`"${pendingConvo?.title || 'This conversation'}" will be gone forever. No take-backs.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        open={!!pendingDeleteId}
      />
    </>
  )
}

export default HistoryBar