import express from 'express'
import db from '../db/connection.js'
import {userTable} from '../models/index.js'
import { eq } from 'drizzle-orm'
import { createHmac, randomBytes } from 'crypto'
const router = express.Router();

router.post('./signup', async (req, res) => {
    // payload from front-end
    const {firstName, lastName, email, password} = req.body;

    const [existingUser] = await db
        .select({
            id: userTable.id // gets id of that user
        })
        .from(userTable)
        .where(eq(userTable.email, email))

    // if user Exist
    if(existingUser) {
        return res
            .status(400)
            .json({error: `The user with ${email} already exist`})
    }
    // hashind the password 
    const salt = randomBytes(256).toString('hex')
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

    // if not adding a new user
    const user = await db.insert(userTable).values({
        // What do we want to store (payload)
        email,
        firstName,
        lastName,
        password: hashedPassword,
        salt,
    }).returning({id: userTable.id}) // getting the new row ID

    return res
        .status(200)
        .json({
            msg: `User created`,
            userId: user.id
        })
})