import React, { useState } from 'react'
import FullChat from '../components/FullChat'
import { Persona } from '../PersonaType'

export type Message = {
  role: string;
  message: string;
};

const Layout = () => {

  const [tab, setTab] = useState<string>(Persona.chillFriend);
  // const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});

  const handleSetTab = (persona:string) =>{
    setTab(persona);
  }

  const [chillFriendMessages, setChillFriendMessaages] = useState<Message[]>([]);
  const [harshCoachMessages, setHarshCoachMessages] = useState<Message[]>([]);
  const [gentleListenerMessages, setGentleListenerMessages] = useState<Message[]>([]);

  const gettersAndSettersForMessages = ():[Message[], React.Dispatch<React.SetStateAction<Message[]>>]  =>{
    if(tab == Persona.chillFriend){
      return [chillFriendMessages, setChillFriendMessaages];
    } else if(tab == Persona.harshCoach){
      return [harshCoachMessages, setHarshCoachMessages];
    } else {
      return [gentleListenerMessages, setGentleListenerMessages];
    }
  }

  const [currentMessages, setCurrentMessages] = gettersAndSettersForMessages();

  // const currentMessages = chatHistories[tab] || [];

  // const setCurrentMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
  //   setChatHistories(prev => {
  //     const updatedMessages = typeof newMessages === 'function' ? newMessages(prev[tab] || []) : newMessages;
  //     return {
  //       ...prev,
  //       [tab]: updatedMessages
  //     };
  //   });
  // };

  return (
    <div className='flex flex-col h-screen items-center justify-center'>


      <div className='flex gap-4 mb-4'>
        <h1
          style={{ backgroundColor: tab === Persona.chillFriend ? "lightblue" : "grey", cursor: "pointer", padding: "8px", borderRadius: "8px", color:"white" }}
          onClick={() => handleSetTab(Persona.chillFriend)}
        >
          Chill Friend
        </h1>
        <h1
          style={{ backgroundColor: tab === Persona.harshCoach ? "lightblue" : "grey", cursor: "pointer", padding: "8px", borderRadius: "8px", color:"white" }}
          onClick={() => handleSetTab(Persona.harshCoach)}
        >
          Harsh Coach
        </h1>
        <h1
          style={{ backgroundColor: tab === Persona.gentleListener ? "lightblue" : "grey", cursor: "pointer", padding: "8px", borderRadius: "8px", color:"white" }}
          onClick={() => handleSetTab(Persona.gentleListener)}
        >
          Gentle Listener
        </h1>
      </div>

      <FullChat persona={tab} messages={currentMessages} setMessages={setCurrentMessages}/>

    </div>
  )
}

export default Layout