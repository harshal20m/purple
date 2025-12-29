const { asyncHandler, sendSuccessResponse } = require("../utils/response");
const adminService = require("../services/adminService");

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await adminService.getAllUsers(page, limit);

  sendSuccessResponse(res, 200, "Users retrieved successfully", result);
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);

  sendSuccessResponse(res, 200, "User retrieved successfully", { user });
});

/**
 * @route   PATCH /api/admin/users/:id/activate
 * @desc    Activate user account
 * @access  Private/Admin
 */
const activateUser = asyncHandler(async (req, res) => {
  const user = await adminService.activateUser(req.params.id);

  sendSuccessResponse(res, 200, "User activated successfully", { user });
});

/**
 * @route   PATCH /api/admin/users/:id/deactivate
 * @desc    Deactivate user account
 * @access  Private/Admin
 */
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await adminService.deactivateUser(req.params.id, req.user._id);

  sendSuccessResponse(res, 200, "User deactivated successfully", { user });
});

module.exports = {
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
};
