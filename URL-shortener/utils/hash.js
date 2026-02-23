import { randomBytes, createHmac } from "crypto"

// id userSalt is there use that if not create a new one
export function hashedPasswordWithSalt(password, userSalt = undefined) {
    const salt = userSalt ?? randomBytes(256).toString('hex')
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex')
        
    return { salt, password: hashedPassword }
}