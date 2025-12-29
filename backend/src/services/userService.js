const User = require("../models/User");
const { ApiError } = require("../utils/response");

/**
 * Update user profile
 */
const updateProfile = async (userId, updateData) => {
  const { email, fullName } = updateData;

  // Check if email is being changed and is already in use
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError("Email already in use", 400);
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { email, fullName } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user.toSafeObject();
};

/**
 * Change user password
 */
const changePassword = async (userId, passwords) => {
  const { currentPassword, newPassword } = passwords;

  // Find user with password
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError("Current password is incorrect", 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

module.exports = {
  updateProfile,
  changePassword,
};
