import User from "../models/User.js";

/**
 * @route   POST /api/auth/login
 * @desc    Return authenticated user (created/fetched by middleware)
 * @access  Private (Firebase)
 */
export const googleLogin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user, // Already populated by verifyFirebaseToken middleware
    });
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private (Firebase)
 */
export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
export const logout = async (req, res) => {
  try {
    // Firebase logout happens on client side
    // This endpoint is for any server-side cleanup if needed
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
