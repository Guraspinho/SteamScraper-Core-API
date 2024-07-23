import express from "express";
import { signup, confirmEmail, resendConfirmationLink } from "../controllers/signup";

const router = express.Router();


router.route("/signup").post(signup);
router.route("/verify/:id").get(confirmEmail);
router.route("/resend/link").post(resendConfirmationLink);

export default router;