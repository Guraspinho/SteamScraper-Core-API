import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";
import {sendVerificationEmail} from "../utils/emails"

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";


interface user
{
    username: string,
    email: string,
    password: string,
    repeatPassword: string
}
export const signup = asyncWrapper( async (req: Request, res: Response) =>
{
    const {username, email, password, repeatPassword}: user = req.body;

    // check if password is repeated in a body
    if(!repeatPassword)
    {
        throw new BadRequestError("Please repeat the password");
    }

    // check if provided passwords match
    if(repeatPassword !== password)
    {
        throw new BadRequestError("Passwords must match");
    }

    // create a new user in a db
    const saveUser = await User.create({username,email,password});
    
    if(!saveUser)
    {
        throw new BadRequestError("Could not save a user");
    }
    
    // send verification link to an email
    const verificationToken = saveUser.emailVerificationToken();
    sendVerificationEmail(email,verificationToken);

    res.status(StatusCodes.OK).json({msg: "User signed up successfully", email: "Confirmation link was sent to your email"});
});

export const confirmEmail = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Email confirmation was successful"});
});


export const resendConfirmationLink = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Confirmation link was sent successfully"});
});