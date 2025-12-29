const { asyncHandler, sendSuccessResponse } = require("../utils/response");
const userService = require("../services/userService");

/**
 * @route   GET /api/users/profile
 * @desc    Get user's own profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user.toSafeObject();
  sendSuccessResponse(res, 200, "Profile retrieved successfully", { user });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  sendSuccessResponse(res, 200, "Profile updated successfully", { user });
});

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user._id, req.body);

  sendSuccessResponse(res, 200, "Password changed successfully");
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
