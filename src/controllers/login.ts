import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";
import InternalServerError from "../errors/internalServer";

import User from "../models/users";
import RefreshToken from "../models/refreshTokens";
import UnauthenticatedError from "../errors/unauthenticated";
import { extractToken } from "../middlewares/authentication";

interface LoginCredentials
{
    email: string,
    password: string,
}
export const login = asyncWrapper( async (req: Request, res: Response) =>
{
    const {email, password}: LoginCredentials = req.body;

    
    // check if email and password were provided
    if(!email || !password) throw new BadRequestError("Please provide valid credentials");

    const user = await User.findOne({email});

    // check if the user exists
    if(!user) throw new NotFoundError("Email or password is incorrect");
    

    // check for password
    const isPasswordCorrect = await user.comparePasswords(password);
    if(!isPasswordCorrect) throw new NotFoundError("Email or password is incorrect");

    // check if the user has their email verified
    if(!user.verified) throw new BadRequestError("You need to verify your email first");    
    
    
    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    // create a refresh token in a db
    const saveRefreshToken = await RefreshToken.create({token: refreshToken});
    if(!saveRefreshToken) throw new InternalServerError("Something went wrong, please try again later");

    res.status(StatusCodes.OK).json({msg: "Logged in successfully", accessToken, refreshToken});
});



// log out 
export const logOut = asyncWrapper( async (req: Request, res: Response) =>
{
    // extract token from authorization headers
    const token = extractToken(req);

    // delete a token from a db
    const refreshToken = await RefreshToken.findOneAndDelete({token});
    if(!refreshToken) throw new UnauthenticatedError("Authentication invalid, need to log in again");

    res.status(StatusCodes.OK).json({msg: "Logged out successfully"});
});


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

