// imports
import express from 'express'
import userRouter from './routes/user.routes.js'
const PORT = process.env.PORT ?? 8000
import adminRouter from './routes/admin.routes.js'
import {authenticationMiddleware} from './middleware/auth.middleware.js'

const app = express()

app.use(express.json())
app.use(authenticationMiddleware)

app.get('/', (req, res) => {
    return res 
        .json({status: `Server is Running`})
        .status(200)
})
app.use('/user', userRouter)

app.use('/admin', adminRouter)

app.listen(PORT, () => {
    console.log("Server is Live....")
})