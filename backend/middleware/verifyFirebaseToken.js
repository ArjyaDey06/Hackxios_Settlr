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

        let user = await User.findOne({ firebaseUid: decoded.uid });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                profilePic: decoded.picture
            });
        }

        req.user = {
            mongoId: user._id,
            firebaseUid: decoded.uid,
            name: user.name,
            email: user.email,
            phone: user.phone || null,
            role: user.role
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default verifyFirebaseToken;
