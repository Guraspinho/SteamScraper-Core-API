import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";
import InternalServerError from "../errors/internalServer";

import User from "../models/users";
import RefreshToken from "../models/refreshTokens";
import { sendPasswordResetEmail } from "../utils/emails";
import UnauthenticatedError from "../errors/unauthenticated";


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
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) throw new UnauthenticatedError("Authentication invalid");

    const refreshToken = authHeader.split(' ')[1];

    const token = await RefreshToken.findOneAndDelete({token: refreshToken});

    if(!token) throw new UnauthenticatedError("Authentication invalid");

    res.status(StatusCodes.OK).json({msg: "Logged out successfully"});
});



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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') ) throw new BadRequestError("invalid token provided");
    

    const token = authHeader.split(' ')[1];


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