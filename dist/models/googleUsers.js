"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const GoogleUser = mongoose_1.default.model("User", googleUsers);
exports.default = GoogleUser;
