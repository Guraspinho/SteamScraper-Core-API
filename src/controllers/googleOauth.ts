import express from "express";
import {OAuth2Client} from "google-auth-library"

import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";
import UnauthenticatedError from "../errors/unauthenticated";

import User from "../models/users";
import GoogleUser from "../models/googleUsers";


export const authorizeServer = asyncWrapper ( async (req: Request,res: Response) =>
{
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');

    // not necessary for a production server
    res.header('referrer-policy', 'no-referrer-when-downgrade'); // This is a security measure to prevent the browser from sending the referrer header to the server.
    
    

    // This is the URL that the user will be redirected to after they have successfully authenticated with Google.
    const redirectUrl = 'http://localhost:5000/response/oauth'; 

    const client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );

    // in production 
    const authorizationUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile openid email'],
        prompt: 'consent',
    });

    res.status(StatusCodes.OK).json({url: authorizationUrl});
});




async function getUserData(access_token: string): Promise<{ given_name: string, email: string }>
{
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    return data;
}

export const authorizeUser = asyncWrapper( async (req: Request, res:Response)=>
{
    const code = req.query.code;
    console.log(code);


    if(!code) throw new UnauthenticatedError("Headers must include auth code");
    
    // 
    if (typeof code !== "string") throw new BadRequestError("Invalid request");


    const redirectUrl = 'http://localhost:5000/response/oauth';
    const client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );  
    
    // get authorization token from google (the one what contains user info).
    try
    {
        const googleResponse = await client.getToken(code);
        await client.setCredentials(googleResponse.tokens);
    }
    catch (error)
    {
        throw new UnauthenticatedError('Invalid or expired token');
    }

    const user = client.credentials;
    if (typeof user !== 'object' || !('access_token' in user) || typeof user.access_token !== 'string')
    {
        throw new BadRequestError("Invalid request");
    }

    // this part is for extracting email from a google token and creating jwt on it  

    let access_token = user.access_token;

    const userData = await getUserData(access_token);

    // extract user data
    const {given_name, email} = userData;

    // check if user with such email exists
    const alreadyUser = await User.findOne({email}); // check if the user is in users collection

    if(alreadyUser)
    {
        throw new BadRequestError("Email already in use try a different one");
    }

    // check if user with such email exists
    const googleUser = await GoogleUser.findOne({email}); // check if the user is in oauths collection

    if(googleUser)
    {
        const token =  googleUser.createAccessToken();
        res.status(StatusCodes.OK).json({msg: "User signed in successfully" , user: {username: given_name, email}, token});
    }
    else
    {
        const newUser = await GoogleUser.create({username: given_name, email});
        const token = newUser.createAccessToken();
        res.status(StatusCodes.CREATED).json( {msg: "User signed up successfully" , user: {usernamename: given_name, email}, token});
    }

});


