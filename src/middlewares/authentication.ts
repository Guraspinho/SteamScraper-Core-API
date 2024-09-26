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

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer '))
    {   
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];

    try
    {
        const payload = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
        req.user = {userID: payload.userID, username:payload.username};
        next();    
    }
    catch (error)
    {
        console.error(error);
        throw new UnauthenticatedError(`Authentication invalid`);       
    }
}

