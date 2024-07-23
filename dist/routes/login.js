"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/login");
const router = express_1.default.Router();
router.route("/login").post(login_1.login);
router.route("/forgotpassword").post(login_1.forgotPassword);
router.route("/resetpassword").post(login_1.resetPassword);
exports.default = router;
