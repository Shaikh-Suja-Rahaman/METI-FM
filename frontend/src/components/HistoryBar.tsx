import React, { useState } from 'react'
import type { Conversation } from '../pages/Layout'
import ConfirmModal from './ConfirmModal'

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
      <div className="neo-history-list">
        {conversations.length === 0 ? (
          <div className="neo-empty">No chats yet.</div>
        ) : (
          conversations.map((convo) => {
            const isActive = convo.id === activeConversationId;
            return (
              <div
                key={convo.id}
                role="button"
                tabIndex={0}
                className={`neo-history-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveConversationId(convo.id)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveConversationId(convo.id)}
              >
                <div className="neo-history-item-header">
                  <div className="neo-history-title">{convo.title}</div>
                  <button
                    className="neo-delete-btn"
                    title="Delete chat"
                    onClick={(e) => handleDeleteClick(e, convo.id)}
                    aria-label="Delete conversation"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <span className={`neo-pill neo-pill--${convo.persona}`}>
                    {personaLabels[convo.persona] || convo.persona}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {pendingDeleteId && (
        <ConfirmModal
          title="Delete this chat?"
          message={`"${pendingConvo?.title || 'This conversation'}" will be gone forever. No take-backs.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </>
  )
}

export default HistoryBar