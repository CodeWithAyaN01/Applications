// imports
import express from 'express'
import userRouter from './routes/user.routes.js'
const PORT = process.env.PORT ?? 8000

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    return res 
        .json({status: `Server is Running`})
        .status(200)
})
app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log("Server is Live....")
})