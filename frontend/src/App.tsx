import { useState } from 'react'


import './App.css'
import FullChat from './components/FullChat'
import { Persona } from './PersonaType'


function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <FullChat persona={Persona.HarshCoach}/>
    </>

  )
}

export default App
