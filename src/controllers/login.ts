import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";

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

export const forgotPassword = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Password reset link was sent to email"});
});


export const resetPassword = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Password was reset successfully"});
});