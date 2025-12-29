import User from "../models/User.js";


/**
 * @route   POST /api/auth/login
 * @desc    Create or fetch user after Google login
 * @access  Private (Firebase)
 */

export const googleLogin = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                name,
                email,
                profilePic: picture,
                verification: {
                    googleVerified: true,
                    phoneProvided: false
                }
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(500).json({ message: "Authentication failed" });
    }
};
