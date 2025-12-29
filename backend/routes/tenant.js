import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
  createOrUpdateTenant,
  getTenantProfile
} from "../controllers/tenant.js";

const router = express.Router();

/**
 * @route   POST /api/tenant/profile
 * @desc    Create or update tenant profile
 * @access  Private
 */
router.post("/profile", verifyFirebaseToken, createOrUpdateTenant);

/**
 * @route   GET /api/tenant/profile
 * @desc    Get logged-in tenant profile
 * @access  Private
 */
router.get("/profile", verifyFirebaseToken, getTenantProfile);

export default router;
