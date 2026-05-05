import React from 'react'


type UserChatBubble = {
  text:string
}

const UserChatBubble = ({text} : UserChatBubble) => {
  return (
    <div className='my-2 flex justify-end'>
    <div className='bg-emerald-100 px-4 py-2 rounded-2xl max-w-[66%] w-fit break-words'>
      {text}
    </div>
    </div>
  )
}

export default UserChatBubble