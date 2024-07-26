"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const notFound_1 = __importDefault(require("../errors/notFound"));
const users_1 = __importDefault(require("../models/users"));
const emails_1 = require("../utils/emails");
exports.login = (0, asyncWrapper_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new badRequest_1.default("Please provide valid credentials");
    const user = await users_1.default.findOne({ email });
    if (!user)
        throw new notFound_1.default("Email or password is incorrect");
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect)
        throw new badRequest_1.default("Email or password is incorrect");
    if (!user.verified)
        throw new badRequest_1.default("You need to verify your email first");
    const token = user.createJWT();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Logged in successfully", token });
});
exports.forgotPassword = (0, asyncWrapper_1.default)(async (req, res) => {
    const email = req.body.email;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email))
        throw new badRequest_1.default("The email address you entered is invalid. Please try again.");
    const user = await users_1.default.findOne({ email });
    if (!user)
        throw new notFound_1.default("The email address you entered is invalid. Please try again.");
    const token = user.createJWT();
    await (0, emails_1.sendPasswordResetEmail)(email, token);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password reset link was sent to your email" });
});
exports.resetPassword = (0, asyncWrapper_1.default)(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new badRequest_1.default("invalid token provided");
    const token = authHeader.split(' ')[1];
    if (!token)
        throw new badRequest_1.default("No token provided");
    const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
    const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
    req.user = { userID: payload.userID, username: payload.username };
    const _id = req.user.userID;
    const user = await users_1.default.findOne({ _id });
    if (!user)
        throw new notFound_1.default(`No user found with ID: ${_id}`);
    let { newPassword, passwordAgain } = req.body;
    console.log(newPassword, passwordAgain);
    if (!newPassword || !passwordAgain)
        throw new badRequest_1.default("Please provide valid passwords");
    if (!passwordAgain || newPassword !== passwordAgain)
        throw new badRequest_1.default("Passwords must match");
    user.password = newPassword;
    await user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password was reset successfully" });
});
