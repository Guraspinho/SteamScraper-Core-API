"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'something went wrong please try again later'
    };
    if (err.name == 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.name == 'CastError') {
        customError.msg = `${err.value} is not a valid ID`;
        customError.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    if (err.code && err.code == 11000) {
        customError.msg = `Email already in use, try a different one.`;
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.default = errorHandlerMiddleware;
