const User = require("../models/User");
const { ApiError } = require("../utils/response");

/**
 * Get all users with pagination
 */
const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    users: users.map((user) => user.toSafeObject()),
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers: totalCount,
      usersPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Activate user account
 */
const activateUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.status === "active") {
    throw new ApiError("User is already active", 400);
  }

  user.status = "active";
  await user.save();

  return user.toSafeObject();
};

/**
 * Deactivate user account
 */
const deactivateUser = async (userId, adminId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError("You cannot deactivate your own account", 400);
  }

  if (user.status === "inactive") {
    throw new ApiError("User is already inactive", 400);
  }

  user.status = "inactive";
  await user.save();

  return user.toSafeObject();
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user.toSafeObject();
};

module.exports = {
  getAllUsers,
  activateUser,
  deactivateUser,
  getUserById,
};
