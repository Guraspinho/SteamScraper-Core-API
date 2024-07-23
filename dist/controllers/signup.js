"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendConfirmationLink = exports.confirmEmail = exports.signup = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
exports.signup = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User signed up successfully" });
});
exports.confirmEmail = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Email confirmation was successful" });
});
exports.resendConfirmationLink = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Confirmation link was sent successfully" });
});
