import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";  // Import the correct types from Express

const notFound = (req: Request , res: Response) => res.status(StatusCodes.NOT_FOUND).send('This page is probably not what you are looking for');

module.exports = notFound;
