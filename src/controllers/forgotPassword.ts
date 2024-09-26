import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";
import { sendPasswordResetEmail } from "../utils/emails";
import { extractToken } from "../middlewares/authentication";


export const forgotPassword = asyncWrapper( async (req: Request, res: Response) =>
{  
    const email: string  = req.body.email;

    // check if email is valid
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) throw new BadRequestError("The email address you entered is invalid. Please try again.");


    // check if user with such email exists
    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError("The email address you entered is invalid. Please try again.");


    const token = user.createAccessToken();
    await sendPasswordResetEmail(email, token);

    res.status(StatusCodes.OK).json({msg: "Password reset link was sent to your email"});
});


interface CustomRequest extends Request
{
    user: {
        userID: string;
        username: string;
    };
}
export const resetPassword = asyncWrapper( async (req: CustomRequest, res: Response) =>
{   
    // extrach token from authorization headers
    const token = extractToken(req);

    if (!token) throw new BadRequestError("No token provided");
    


    const jwtSecret = process.env.JWT_SECRET || 'defaultSecret'; // Set a default secret if JWT_SECRET is undefined
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = { userID: payload.userID, username: payload.username };
    
    const _id = req.user.userID;

    const user = await User.findOne({ _id });

    if (!user) throw new NotFoundError(`No user found with ID: ${_id}`);
    

    // extract
    let {newPassword, passwordAgain} = req.body;


    console.log(newPassword, passwordAgain);

    if(!newPassword || !passwordAgain) throw new BadRequestError("Please provide valid passwords");
    


    // checking if passwords match
    if (!passwordAgain || newPassword !== passwordAgain) throw new BadRequestError("Passwords must match");
    


    // update password
    user.password = newPassword;
    await user.save();


    res.status(StatusCodes.OK).json({msg: "Password was reset successfully"});
});