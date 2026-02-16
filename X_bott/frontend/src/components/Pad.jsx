import { useState } from 'react'
import Card from './card'
import { GoogleGenAI } from "@google/genai"

const Pad = () => {
    const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY
    })
    const [text, settext] = useState(``)
    // current loading state
    const [loading, setloading] = useState(false) 
    const [result, setresult] = useState(null)
    const [speech, setspeech] = useState(null)

    const sendToGoole = async () => {
        if(!text) return alert("please enter some text")

    setloading(true)
    try{
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-preview",
            contents:`Summarise the following text -> ${text}`
        })
        const cleanText = response.text.replace(/\*\*/g, "")
        //result
        setresult(cleanText)
    }
    catch(error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        setresult("Failed to get a response. Check console for details.");
    }
    finally{
        setloading(false)
    }
}
const speakText = () => {
        if(!result) return

        // this will read this
        const utter = new SpeechSynthesisUtterance(result)
        utter.lang = "en-US"
        utter.rate = 1
        utter.pitch = 1
        setspeech(utter)

        window.speechSynthesis.speak(utter)
    }
    const pauseSpeech = () => {
    window.speechSynthesis.pause()
    }

    const resumeSpeech = () => {
    window.speechSynthesis.resume()
    }

    const stopSpeech = () => {
    window.speechSynthesis.cancel()
    }
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-10">

    <textarea
      value={text}
      onChange={(e) => settext(e.target.value)}
      placeholder="Give Your Details..."
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

    <div className="flex flex-wrap gap-2 p-4">
    <button
        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        onClick={speakText}
    >
        ▶ Play
    </button>
    
    <button
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        onClick={pauseSpeech}
    >
        ⏸ Pause
    </button>
    
    <button
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-800 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        onClick={resumeSpeech}
    >
        ⏯ Resume
    </button>
    
    <button
        className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95 border-2 border-gray-300"
        onClick={stopSpeech}
    >
        ⏹ STOP
    </button>
</div>
    
  </div>
    
  )
}

export default Pad

// https://apyhub.com/dashboard