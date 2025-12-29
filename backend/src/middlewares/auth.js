const { verifyToken } = require("../utils/jwt");
const { sendErrorResponse } = require("../utils/response");
const User = require("../models/User");

/**
 * Protect routes - require valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendErrorResponse(
        res,
        401,
        "Authentication required. Please log in."
      );
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if user still exists
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return sendErrorResponse(res, 401, "User no longer exists.");
      }

      // Check if user is active
      if (user.status === "inactive") {
        return sendErrorResponse(
          res,
          403,
          "Your account has been deactivated. Please contact support."
        );
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return sendErrorResponse(
        res,
        401,
        error.message || "Invalid or expired token."
      );
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Authentication failed.");
  }
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, "Authentication required.");
    }

    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        403,
        "You do not have permission to perform this action."
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
