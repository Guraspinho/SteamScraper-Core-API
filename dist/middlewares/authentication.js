"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const unauthenticated_1 = __importDefault(require("../errors/unauthenticated"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new unauthenticated_1.default('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        req.user = { userID: payload.userID, username: payload.username };
        next();
    }
    catch (error) {
        console.error(error);
        throw new unauthenticated_1.default(`Authentication invalid`);
    }
};
exports.auth = auth;
