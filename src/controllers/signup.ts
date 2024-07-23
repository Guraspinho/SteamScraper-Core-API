import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";


export const signup = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "User signed up successfully"});
});

export const confirmEmail = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Email confirmation was successful"});
});


export const resendConfirmationLink = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Confirmation link was sent successfully"});
});