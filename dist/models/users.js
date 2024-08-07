"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userSchema = new mongoose_1.default.Schema({
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
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is undefined");
const JWT_SECRET = process.env.JWT_SECRET;
userSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userID: this._id, username: this.username }, JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
userSchema.methods.emailVerificationToken = function () {
    return jsonwebtoken_1.default.sign({ userID: this._id, username: this.username }, JWT_SECRET, { expiresIn: process.env.CONFIRMATION_TOKEN_LIFETIME });
};
userSchema.methods.passwordResetToken = function () {
    return jsonwebtoken_1.default.sign({ userID: this._id, username: this.username }, JWT_SECRET, { expiresIn: process.env.PASSWORD_RESET_TOKEN_LIFETIME });
};
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await argon2_1.default.hash(this.password);
        this.password = hashedPassword;
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await argon2_1.default.verify(this.password, candidatePassword);
    return isMatch;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
