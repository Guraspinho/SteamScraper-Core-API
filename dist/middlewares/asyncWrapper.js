"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper = (fun) => {
    return async (req, res, next) => {
        try {
            await fun(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = asyncWrapper;
