import express from "express";
import { login, forgotPassword, resetPassword} from "../controllers/login";

const router = express.Router();


router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetPassword);

export default router;