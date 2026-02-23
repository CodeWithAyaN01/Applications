import jwt from 'jsonwebtoken'
import {userTokenSchema} from '../validation/token.validation.js'

export async function createUserToken(payload) {
    const validationResult = await userTokenSchema.safeParseAsync(payload) // validating payload

    if(!validationResult.success) {
        throw new Error(validationResult.error.message)
    }
    const token = jwt.sign( validationResult.data, process.env.JWT_CODE)
    return token
}

export async function validateUserToken(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_CODE)
        return payload
        
    } catch (error) {
        return null
    }
}