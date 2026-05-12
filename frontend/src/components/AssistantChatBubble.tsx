import React from 'react'

type AssistantChatBubbleProps = {
  text: string
}

const AssistantChatBubble = ({ text }: AssistantChatBubbleProps) => {
  return (
    <div className="bubble-row bubble-row--assistant">
      <div className="bubble bubble-assistant">
        {text}
      </div>
    </div>
  )
}

export default AssistantChatBubble