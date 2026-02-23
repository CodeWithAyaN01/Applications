import db from '../db/connection.js'
import express from 'express'
import { userTable } from '../models/user.model.js'
const router = express.Router()


router.get('/fetch', async (req, res) => {
    try{
        const allUsers = await db
        .select({
            thisId: userTable.id,
            name: userTable.firstName,
            name_last: userTable.lastName
        })
        .from(userTable)

        return res
            .status(200)
            .json({allUsers})
    }catch(error){
        console.error("/fetch Route Error")
    }
})
export default router
