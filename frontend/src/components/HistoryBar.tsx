import React, { useState } from 'react'
import type {Conversation} from '../pages/Layout'


type HistoryBarProps = {
  conversations : Conversation[];
  setActiveConversationId : React.Dispatch<React.SetStateAction<string | null>>;
}

const HistoryBar = ({conversations,setActiveConversationId }:HistoryBarProps) => {

  return (
    <div>
      {conversations.map((convo)=>{
        return (
          <div onClick={()=> setActiveConversationId(convo.id)}>
            {convo.title}
          </div>
        )
      })}
    </div>
  )
}

export default HistoryBar