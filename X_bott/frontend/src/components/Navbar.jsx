import React from 'react'
import image from '../assets/logo.png'

const Navbar = (props) => {
  return (
    <div className="bg-black text-white px-6 py-3">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <img src={image} alt="X logo" className="w-22 mt-2" />

        {/* Center text */}
        <h2 className="text-5xl font-mono text-center ">
          {props.text}
        </h2>

        {/* Empty space to balance right side */}
        <div className="w-12"></div>

      </div>
    </div>
  )
}

export default Navbar
