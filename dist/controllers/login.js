"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
exports.login = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Logged in successfully" });
});
exports.forgotPassword = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password reset link was sent to email" });
});
exports.resetPassword = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password was reset successfully" });
});
