import { StatusCodes } from "http-status-codes";
import UnauthenticatedError from "../errors/unauthenticated";
import asyncWrapper from "../middlewares/asyncWrapper";
import { extractToken } from "../middlewares/authentication";
import RefreshToken from "../models/refreshTokens";
import {Request, Response} from "express"
import jwt, { JwtPayload } from "jsonwebtoken";

// Exchange refresh token for an access one
export const exchangeTokens = asyncWrapper(async(req: Request,res:Response) =>
    {
        // extract token from authorization headers
        const token = extractToken(req);
    
        const refreshToken = await RefreshToken.findOne({token});
        if(!refreshToken) throw new UnauthenticatedError("Authentication invalid, need to log in again");
    
        // verify a refresh token and extract relevant information
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || '') as JwtPayload;
        const {userID, username} = payload;
        
        
        // typescript check
        if(!process.env.ACCESS_TOKEN_SECRET ) throw new Error("ACCESS_TOKEN_SECRET is undefined");
        const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
    
        // create an access token.
        const accessToken = jwt.sign({userID,username}, ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_LIFETIME});
    
        res.status(StatusCodes.OK).json({msg:"Tokens were successfully exchanged", accessToken});
    
    });
    
    