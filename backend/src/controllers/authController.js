const { asyncHandler, sendSuccessResponse } = require("../utils/response");
const authService = require("../services/authService");

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);

  sendSuccessResponse(res, 201, "User registered successfully", {
    user: result.user,
    token: result.token,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  sendSuccessResponse(res, 200, "Login successful", {
    user: result.user,
    token: result.token,
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  sendSuccessResponse(res, 200, "User retrieved successfully", { user });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Logout is handled client-side by removing the token
  sendSuccessResponse(res, 200, "Logout successful");
});

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
};
