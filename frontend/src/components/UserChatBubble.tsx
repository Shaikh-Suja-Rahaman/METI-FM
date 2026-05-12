import React from 'react'

type UserChatBubbleProps = {
  text: string
}

const UserChatBubble = ({ text }: UserChatBubbleProps) => {
  return (
    <div className="bubble-row bubble-row--user">
      <div className="bubble bubble-user">
        {text}
      </div>
    </div>
  )
}

export default UserChatBubble