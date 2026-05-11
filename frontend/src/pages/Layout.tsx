import React from 'react'
import FullChat from '../components/FullChat'
import { Persona } from '../PersonaType'

const Layout = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <FullChat persona={Persona.chillFriend}/>

    </div>
  )
}

export default Layout