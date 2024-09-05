"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendConfirmationLink = exports.confirmEmail = exports.signup = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const emails_1 = require("../utils/emails");
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const notFound_1 = __importDefault(require("../errors/notFound"));
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signup = (0, asyncWrapper_1.default)(async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;
    if (!repeatPassword)
        throw new badRequest_1.default("Please repeat the password");
    if (repeatPassword !== password)
        throw new badRequest_1.default("Passwords must match");
    const saveUser = await users_1.default.create({ username, email, password });
    if (!saveUser)
        throw new badRequest_1.default("Could not save a user");
    const verificationToken = saveUser.emailVerificationToken();
    await (0, emails_1.sendVerificationEmail)(email, verificationToken);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User signed up successfully", email: "Please verify your email" });
});
exports.confirmEmail = (0, asyncWrapper_1.default)(async (req, res) => {
    const token = req.query.token;
    if (!token || typeof token !== "string")
        throw new badRequest_1.default("An error occured, please try again later");
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is undefined");
    let tokenInfo;
    tokenInfo = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    const user = await users_1.default.findOne({ _id: tokenInfo.userID });
    if (!user)
        throw new notFound_1.default("User not found");
    user.verified = true;
    user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Email verification was successful" });
});
exports.resendConfirmationLink = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Confirmation link was sent successfully" });
});
