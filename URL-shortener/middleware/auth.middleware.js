import {validateUserToken} from '../utils/token.js'
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

export function authenticationMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']

    if(!authHeader)
        return next()

    if(!authHeader.startsWith('Bearer')) {
        return res
            .status(400)
            .json({error: `authorization header not start with Brarer`})
    }
    // extracting only token
    const [_ , token] = authHeader.split(' ') // authHeader => Bearer <TOEKN>

    const payload =  validateUserToken(token)

    // creating a new property in req as req.user
    // other Routes can assess this req.user as it contails user details
    req.user = payload

}
