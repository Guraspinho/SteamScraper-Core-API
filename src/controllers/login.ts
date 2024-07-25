import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";
import { sendPasswordResetEmail } from "../utils/emails";

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
    if(!isPasswordCorrect) throw new BadRequestError("Email or password is incorrect");

    // check if the user has their email verified
    if(!user.verified) throw new BadRequestError("You need to verify your email first");    
    
    
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({msg: "Logged in successfully", token});
});


export const forgotPassword = asyncWrapper( async (req: Request, res: Response) =>
{  
    const email: string  = req.body.email;

    // check if email is valid
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email))
    {
        throw new BadRequestError("The email address you entered is invalid. Please try again.");
    }

    // check if user with such email exists
    const user = await User.findOne({ email });

    if (!user)
    {
        throw new NotFoundError("The email address you entered is invalid. Please try again.");
    }

    const token = user.createJWT();
    await sendPasswordResetEmail(email, token);

    res.status(StatusCodes.OK).json({msg: "Password reset link was sent to email"});
});


export const resetPassword = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Password was reset successfully"});
});