import express from 'express'
import { signupPostReqBodySchema, loginPostReqBodySchema } from '../validation/request.validation.js'
import { createUser, getUserByEmail } from '../services/user.service.js'
import { hashedPasswordWithSalt } from '../utils/hash.js'
import { createUserToken } from '../utils/token.js'
import  jwt  from 'jsonwebtoken'
const router = express.Router();
router.post('/signup', async (req, res) => {
    try {
        // ZOD validation 
        const validationResult = await signupPostReqBodySchema.safeParseAsync(req.body);

        // checking for error using zod
        if(validationResult.error) {
            return res
                .status(400)
                .json({error: validationResult.error })
        }
        // getting Valid imputs
        const {firstName, lastName, email, password} = validationResult.data // use .data to get validated results


        const existingUser = await getUserByEmail(email)
        // if user Exist
        if(existingUser) {
            return res
                .status(400)
                .json({error: `The user with ${email} already exist`})
        }
        
        const user = await createUser(firstName, lastName, email, password)
        
        return res
            .status(200)
            .json({
                msg: `User created`,
                userId: user.id
            })
    }catch(error) {
        console.error(`signUp route Error `)
        return res
            .status(500)
            .json({err: `SignUp error!`})
    }
})

router.post('/login', async (req, res) => {
    try{
        const validationResult = await loginPostReqBodySchema.safeParseAsync(req.body)

        if(!validationResult.success) {
            return res
                .status(400)
                .json({error: validationResult.error })
        }

        const {email, password} = validationResult.data

        const user = await getUserByEmail(email)
        if(!user) {
            return res
                .status(404)
                .json({error : `The user with ${email} Does not Exist Goto /signup`})
        }
        // console.log(user)
        const {password: hashedPassword } = hashedPasswordWithSalt(password, user.salt)

        if(hashedPassword !== user.password) {
            return res
                .status(400)
                .json({error: `Invalid password`})
        }
        // Creating payload
        const payload = {
            id: user.id
        }
        const token = await createUserToken(payload)
        return res
            .status(200)
            .json({token_code: token})
    }catch(error) {
        return res
            .status(400)
            .json({error: `The /login Error !`})
        }
    

})
export default router 