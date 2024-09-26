import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";
import {sendVerificationEmail} from "../utils/emails"

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";

import jwt from "jsonwebtoken";
 

interface user
{
    username: string,
    email: string,
    password: string,
    repeatPassword: string
}
export const signup = asyncWrapper( async (req: Request, res: Response) =>
{

    let {username, email, password, repeatPassword}: user = req.body;

    // check if password is repeated in a body
    if(!repeatPassword) throw new BadRequestError("Please repeat the password");
    
    // check if provided passwords match
    if(repeatPassword !== password) throw new BadRequestError("Passwords must match");

  
    // A password must contain at least one uppercase character, one number and has to be at least 8 characters long.
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isPasswordValid = password.match(regex)

    if(!isPasswordValid) throw new BadRequestError("The password is invalid, try a different one");

    email = email.toLowerCase();
    // create a new user in a db
    const saveUser = await User.create({username,email,password});

    if(!saveUser) throw new BadRequestError("Could not save a user");


    // send verification link to an email
    const verificationToken = saveUser.emailVerificationToken();
    await sendVerificationEmail(email,verificationToken);

    res.status(StatusCodes.OK).json({msg: "User signed up successfully", email:  "Please verify your email"});
});

interface TokenInfo
{ 
    userID: string;
    username: string;
    iat: number;
    exp: number;
}
export const confirmEmail = asyncWrapper( async (req: Request, res: Response) =>
{
    const token = req.query.token;
    if(!token || typeof token !== "string") throw new BadRequestError("An error occured, please try again later");

    
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!JWT_SECRET) throw new Error("JWT_SECRET is undefined");

    let tokenInfo: TokenInfo;
    tokenInfo = jwt.verify(token, JWT_SECRET) as TokenInfo;

    
    const user = await User.findOne({_id:tokenInfo.userID});

    if(!user) throw new NotFoundError("User not found");

    user.verified = true;

    user.save();


    // verify the token and update the verified value to true for the users.
    res.status(StatusCodes.OK).json({msg: "Email verification was successful"});
});


export const resendConfirmationLink = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Confirmation link was sent successfully"});
});