"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleUsers = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please provide username"],
        max: 30
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide email address"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"]
    },
}, { timestamps: true });
if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is undefined");
const JWT_SECRET = process.env.JWT_SECRET;
googleUsers.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userID: this._id, username: this.username }, JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
const GoogleUser = mongoose_1.default.model("GoogleUser", googleUsers);
exports.default = GoogleUser;
