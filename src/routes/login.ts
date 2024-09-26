import express from "express";
import { login, logOut, exchangeTokens} from "../controllers/login";
import { forgotPassword, resetPassword } from "../controllers/forgotPassword";

const router = express.Router();


router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetPassword);
router.route("/logout").post(logOut);
router.route("/token").get(exchangeTokens);

export default router;