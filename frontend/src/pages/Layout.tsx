import React, { useEffect, useState } from 'react'
import FullChat from '../components/FullChat'
import { Persona } from '../PersonaType'
import HistoryBar from '../components/HistoryBar';

export type Message = {
  role: string;
  message: string;
};

export type Conversation = {
  id: string;           // unique id, e.g. timestamp
  persona: string;      // "chillFriend" | "harshCoach" | "gentleListener"
  title: string;        // first message preview, e.g. "Hey how are you..."
  createdAt: number;    // Date.now()
  messages: Message[];
};

const Layout = () => {


  const [selectedPersona, setSelectedPersona] = useState<string>(Persona.chillFriend);


const [conversations, setConversations] = useState<Conversation[]>(() => {
  try {
    return JSON.parse(localStorage.getItem("conversations") || "[]");
  } catch {
    localStorage.removeItem("conversations"); // wipe the corrupted data
    return [];
  }
});

  useEffect(()=>{
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const createNewChat = () =>{

    const newConvo: Conversation = {
      id: Date.now().toString(),
      persona:selectedPersona,
      title:"New Conversation",
      createdAt:Date.now(),
      messages: [] //intially it would be emoty
    }

    setConversations((prev) => [...prev, newConvo]);
    setActiveConversationId(newConvo.id);

  }

  const activeConversation = conversations.find(c => c.id == activeConversationId);

  const currentMessages = activeConversation?.messages || [];

  // const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});

  // const [chillFriendMessages, setChillFriendMessaages] = useState<Message[]>([]);
  // const [harshCoachMessages, setHarshCoachMessages] = useState<Message[]>([]);
  // const [gentleListenerMessages, setGentleListenerMessages] = useState<Message[]>([]);

  // const gettersAndSettersForMessages = ():[Message[], React.Dispatch<React.SetStateAction<Message[]>>]  =>{
  //   if(tab == Persona.chillFriend){
  //     return [chillFriendMessages, setChillFriendMessaages];
  //   } else if(tab == Persona.harshCoach){
  //     return [harshCoachMessages, setHarshCoachMessages];
  //   } else {
  //     return [gentleListenerMessages, setGentleListenerMessages];
  //   }
  // }

  // const [currentMessages, setCurrentMessages] = gettersAndSettersForMessages();


  const setCurrentMessages = (updater:Message[] | ((prev: Message[]) => Message[])) => {
  setConversations(prev => prev.map(convo =>
    convo.id === activeConversationId
      ? { ...convo, messages: typeof updater === 'function' ? updater(convo.messages) : updater }
      : convo
  ));
};




  return (
    <div className='flex h-screen'>
    <div className='w-64 flex flex-col border-r p-4'>

      <select
        value={selectedPersona}
        onChange={(e)=> setSelectedPersona(e.target.value)}
        className='border rounded p-2'
      >
        <option value={Persona.chillFriend}>Chill Friend</option>
        <option value={Persona.gentleListener}> Gentle Listener</option>
        <option value={Persona.harshCoach}>Harsh Coach</option>

      </select>

      <button onClick={createNewChat} className='mb-4 bg-blue-500 text-white p-2 rounded'>
        + New Chat
      </button>
      <HistoryBar
        conversations={conversations}
        setActiveConversationId={setActiveConversationId}
      />
    </div>
    <div className='flex flex-col h-screen items-center justify-center'>



      {/* <div className='flex gap-4 mb-4'>

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
      </div> */}

      {activeConversationId && activeConversation
        ? <FullChat persona={activeConversation.persona} messages={currentMessages} setMessages={setCurrentMessages} />
        : <p className='text-gray-400'>Create a new chat to get started</p>
      }

      {/* <FullChat persona={tab} messages={currentMessages} setMessages={setCurrentMessages}/> */}

    </div>
    </div>
  )
}

export default Layout