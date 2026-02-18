// imports
import express from 'express'
const PORT = process.env.PORT ?? 8000

const app = express()

app.get('/', (req, res) => {
    return res 
        .json({status: `Server is Running`})
        .status(200)
})

app.listen(PORT, () => {
    console.log("Server is Live....")
})