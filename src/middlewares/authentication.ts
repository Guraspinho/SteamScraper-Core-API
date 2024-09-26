import UnauthenticatedError from "../errors/unauthenticated"
import  jwt, { JwtPayload }  from "jsonwebtoken";

import {NextFunction, Request,Response} from "express"

interface CustomRequest extends Request
{
    user: {
        userID: string;
        username: string;
    };
}

// extract Json Web Token from authorization headers
export function extractToken(req: Request): string
{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) throw new UnauthenticatedError("Authentication invalid");
    const token = authHeader.split(' ')[1];

    return token;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) =>
{
    const token = extractToken(req);

    try
    {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '') as JwtPayload;
        req.user = {userID: payload.userID, username:payload.username};
        next();    
    }
    catch (error)
    {
        console.error(error);
        throw new UnauthenticatedError(`Authentication invalid`);       
    }
}

// Logic
// if the autheader is invalid the error will be thrown, frontend will catch this error and withought the user knowing, It will send request at token endpoint
// with Refresh token present in headers, the server will give access token as a response and user will be redirected on a desired page
