import React, {useState} from 'react'
import AssistantChatBubble from './AssistantChatBubble';
import UserChatBubble from './UserChatBubble';

type FullCharProps = {
  persona: string;
}

const FullChat = ({persona}: FullCharProps) => {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');


return (
  <div className="flex flex-col h-[90vh] w-[90vw]">

    {/* Chat area */}
    <div className="flex-1 bg-blue-300 overflow-y-auto p-4">
     <AssistantChatBubble text="Hey! How can I help you today?" />
<UserChatBubble text="Hey, I’m trying to build a chat UI in React." />

<AssistantChatBubble text="Nice, that’s a great project. Are you working with Tailwind?" />
<UserChatBubble text="Yeah, but I’m struggling with layout and message bubbles." />

<AssistantChatBubble text="Got it. Are your messages stacking properly and scrolling?" />
<UserChatBubble text="Stacking works, but scrolling feels a bit off." />

<AssistantChatBubble text="You probably need overflow-y-auto on the chat container and flex-1 to fill space." />
<UserChatBubble text="Ohhh okay, I didn’t fully understand flex-1 before." />

<AssistantChatBubble text="Yeah, flex-1 basically takes up the remaining space in a flex container." />
<UserChatBubble text="That makes sense. Also, how do I keep the input fixed at the bottom?" />

<AssistantChatBubble text="Use a flex column layout with the chat area as flex-1 and input below it." />
<UserChatBubble text="Alright, that actually sounds clean." />

<AssistantChatBubble text="Also, make sure your chat bubbles use max width and w-fit so they don’t stretch." />
<UserChatBubble text="Yeah I just fixed that, looks much better now." />

<AssistantChatBubble text="Nice! Next step would be mapping messages from state instead of hardcoding." />
<UserChatBubble text="Yeah I was just about to ask that 😄" />

<AssistantChatBubble text="Perfect timing. Want help setting up message state and rendering?" />
<UserChatBubble text="Yes please, that would help a lot." />

<AssistantChatBubble text="Cool, we’ll create a messages array and map over it to render bubbles dynamically." />
<UserChatBubble text="Let’s do it 🚀" />
    </div>

    {/* Input box */}
    <div className="p-4 border-t">
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>

  </div>
)
}
export default FullChat;
