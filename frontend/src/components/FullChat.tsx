import React, {useState} from 'react'

type FullCharProps = {
  persona: string;
}

const FullChat = ({persona}: FullCharProps) => {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');



  return (
    <div>
      <h1>
        {persona}
      </h1>
      <input type='text'/>

    </div>
  )
}

export default FullChat