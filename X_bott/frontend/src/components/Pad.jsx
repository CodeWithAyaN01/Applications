import React, { useState } from 'react'
import axios from 'axios'
import Card from './card'

const Pad = () => {
    const [text, settext] = useState(``)
    // current loading state
    const [loading, setloading] = useState(false) 
    const [result, setresult] = useState(null)

    const sendToGoole = async () => {
        if(!text) return alert("please enter some text")

    setloading(true)
    try{
        // API For GOOGLE
       const API_KEY = import.meta.env.VITE_API_KEY
       const URL = import.meta.env.VITE_URL
      

        const response = await axios.post(
            import.meta.env.VITE_URL2, // Endpoint
        {
            url: text,
        },
        {
            headers: 
            {
                "Content-Type": "application/json",
                "apy-token": import.meta.env.VITE_KEY_APY
            }
        },
    )
        // taking the output
        // const output = response.data.candidates[0].content.parts[0].text
        setresult(response.data.data.summary)
    }
    catch(error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        setresult("Failed to get a response. Check console for details.");
    }
    finally{
        setloading(false)
    }
}
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-10">

    <textarea
      value={text}
      onChange={(e) => settext(e.target.value)}
      placeholder="Ask something..."
      className="w-full max-w-2xl h-100 bg-gray-200/85 text-black p-4 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button className="bg-green-600 mt-5 px-8 py-3 rounded-full 
        text-white font-semibold
        transition-all duration-200 ease-in-out
        hover:bg-green-700 hover:scale-105
        active:scale-95 active:bg-green-800
        shadow-lg hover:shadow-green-500/40"
        onClick={sendToGoole} disabled={loading} // true or false value disable the button when loading
        >
            {loading ? "Sending..." : "Submit"}
    </button>
    <br />

    {/* only the result appear */}

    {result && <Card text={result} />} 
  </div>
    
  )
}

export default Pad