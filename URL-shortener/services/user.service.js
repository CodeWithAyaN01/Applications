import { eq } from 'drizzle-orm'
import db from '../db/connection.js'
import { userTable } from '../models/user.model.js'
import { hashedPasswordWithSalt } from '../utils/hash.js'

export async function getUserByEmail(email) {
    try {
        const [existingUser] = await db
        .select({
            id: userTable.id,
            firstName: userTable.firstName,
            lastName: userTable.lastName,
            email: userTable.email,
            password: userTable.password,
            salt: userTable.salt
        })
        .from(userTable)
        .where(eq(userTable.email, email))

        return existingUser
    }catch(error) {
        console.error(`Function getUserByEmail error`)
    }
}

export async function createUser(firstName, lastName, email, password) {
    try{
        const {salt, password: hashedPassword} = hashedPasswordWithSalt(password)
        const [user] = await db.insert(userTable).values({
            // What do we want to store (payload)
            email,
            firstName,
            lastName,
            password: hashedPassword,
            salt,
        }).returning({id: userTable.id})
        return user
    }catch(error) {
        throw error
    }
}

export async function createToken() {

}