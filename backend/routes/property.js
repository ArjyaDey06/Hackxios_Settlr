import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
    createProperty,
    getAllProperties,
    getPropertiesByCity,
    getOwnerProperties,    // ✅ ADD THIS
    getPropertyById,       // ✅ ADD THIS
    updateProperty,        // ✅ ADD THIS
    deleteProperty,        // ✅ ADD THIS
    searchProperties       // ✅ ADD THIS (optional)
} from "../controllers/property.js";

const router = express.Router();

// ⚠️ IMPORTANT: Specific routes BEFORE generic routes!

// Protected routes (require authentication)
router.get("/my-properties", verifyFirebaseToken, getOwnerProperties);  // ✅ ADD THIS!
router.post("/", verifyFirebaseToken, createProperty);
router.put("/:id", verifyFirebaseToken, updateProperty);                // ✅ ADD THIS!
router.delete("/:id", verifyFirebaseToken, deleteProperty);             // ✅ ADD THIS!

// Public routes (no authentication)
router.get("/search", searchProperties);                                // ✅ ADD THIS (optional)
router.get("/city", getPropertiesByCity);
router.get("/:id", getPropertyById);                                    // ✅ ADD THIS!
router.get("/", getAllProperties);

export default router;
