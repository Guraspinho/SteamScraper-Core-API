import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) =>
{
    let customError = 
    {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'something went wrong please try again later'
    };

    if(err.name == 'ValidationError')
    {
        customError.msg = Object.values(err.errors)
        .map((item: any) => item.message)
        .join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    
    if(err.name == 'CastError')
    {
        customError.msg = `${err.value} is not a valid ID`
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    if(err.code && err.code == 11000)
    {
        customError.msg = `Email already in use, try a different one.`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    return res.status(customError.statusCode).json( {msg: customError.msg });
}


export default errorHandlerMiddleware;