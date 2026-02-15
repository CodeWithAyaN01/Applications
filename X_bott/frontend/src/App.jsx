import React from 'react'
import Navbar from './components/Navbar'
import Pad from './components/Pad'

const App = () => {
  return (
    <div className='bg-black min-h-screen w-full'>
      <Navbar text='Welcome to PointX' />
      <div>
        <Pad />
      </div>
    </div>
  )
}

export default App