import { useState } from 'react'


import './App.css'
import FullChat from './components/FullChat'
import { Persona } from './PersonaType'
import Layout from './pages/Layout'


function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      {/* <FullChat persona={Persona.HarshCoach}/> */}
      <Layout/>
    </>

  )
}

export default App
