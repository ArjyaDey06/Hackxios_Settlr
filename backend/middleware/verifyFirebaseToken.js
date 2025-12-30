import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        if (!decoded.uid) {
            return res.status(401).json({ message: "Invalid Firebase token" });
        }

        let user = await User.findOne({ firebaseUid: decoded.uid });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name || "User",
                email: decoded.email,
                profilePic: decoded.picture || null
            });
        }

        // ✅ FIX: Add uid field (not just firebaseUid)
        req.user = {
            uid: user.firebaseUid,           // ✅ ADD THIS!
            mongoId: user._id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            email: user.email,
            phone: user.phone || null,
            role: user.role || "tenant"
        };

        console.log("Decoded Firebase User:", decoded);
        console.log("✅ req.user.uid:", req.user.uid);  // ✅ Debug log

        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default verifyFirebaseToken;
