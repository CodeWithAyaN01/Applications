import React from 'react'

const card = (props) => {
  return (
    <div className='bg-white rounded-xl shadow-lg p-6 m-10'>
        <h1 className='font-bold text-3xl'>PointX Summary</h1>
        <br />
        <p className='text-xl font-mono p-3'>
            {props.text}
        </p>
    </div>
  )
}

export default card