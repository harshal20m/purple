const User = require("../models/User");
const { generateToken, createTokenPayload } = require("../utils/jwt");
const { ApiError } = require("../utils/response");

/**
 * User signup service
 */
const signup = async (userData) => {
  const { email, password, fullName } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("Email already registered", 400);
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    fullName,
    role: "user", // Default role
  });

  // Generate token
  const tokenPayload = createTokenPayload(user);
  const token = generateToken(tokenPayload);

  return {
    user: user.toSafeObject(),
    token,
  };
};

/**
 * User login service
 */
const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  // Check if user is active
  if (user.status === "inactive") {
    throw new ApiError(
      "Your account has been deactivated. Please contact support.",
      403
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const tokenPayload = createTokenPayload(user);
  const token = generateToken(tokenPayload);

  return {
    user: user.toSafeObject(),
    token,
  };
};

/**
 * Get current user profile
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user.toSafeObject();
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
