import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";

import User from "../models/users";


export const login = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Logged in successfully"});
});

export const forgotPassword = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Password reset link was sent to email"});
});


export const resetPassword = asyncWrapper((req: Request, res: Response) =>
{
    res.status(StatusCodes.OK).json({msg: "Password was reset successfully"});
});