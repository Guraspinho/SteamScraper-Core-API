import express from "express";
import { exchangeTokens } from "../controllers/exchangetokens";

const router = express.Router();



router.route("/exchange").get(exchangeTokens);


export default router;