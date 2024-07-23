"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = require("../controllers/signup");
const router = express_1.default.Router();
router.route("/signup").post(signup_1.signup);
router.route("/verify/:id").get(signup_1.confirmEmail);
router.route("/resend/link").post(signup_1.resendConfirmationLink);
exports.default = router;
