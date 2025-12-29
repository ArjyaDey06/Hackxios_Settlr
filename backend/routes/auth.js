import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { googleLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", verifyFirebaseToken, googleLogin);

export default router;
