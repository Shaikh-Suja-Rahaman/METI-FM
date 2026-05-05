import React from 'react'


type AssistantChatBubbleProps = {
  text:string
}

const AssistantChatBubble = ({text} : AssistantChatBubbleProps) => {
  return (
    <div className='my-2 flex justify-start'>
    <div className='bg-white px-4 py-2 rounded-2xl max-w-[66%] w-fit break-words'>
      {text}
    </div>
    </div>
  )
}

export default AssistantChatBubble