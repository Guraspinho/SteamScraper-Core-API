import express  from "express";

const router = express.Router();

import {authorizeServer, authorizeUser} from "../controllers/googleOauth"

router.route("/google/request").post(authorizeServer);
router.route("/google/response").get(authorizeUser);

export default router;