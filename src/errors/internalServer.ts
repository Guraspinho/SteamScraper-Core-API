import CustomAPIError from "./customApiError";
import { StatusCodes } from "http-status-codes";

class InternalServerError extends CustomAPIError
{
    statusCode: StatusCodes;
    constructor(message: string)
    {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export default InternalServerError;