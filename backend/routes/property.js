import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
    createProperty,
    getAllProperties,
    getPropertiesByCity
} from "../controllers/property.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createProperty);
router.get("/", getAllProperties);
router.get("/city", getPropertiesByCity);

export default router;
