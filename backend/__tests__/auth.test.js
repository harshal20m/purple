const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  verifyToken,
  createTokenPayload,
} = require("../src/utils/jwt");
const { signup, login } = require("../src/services/authService");
const {
  activateUser,
  deactivateUser,
} = require("../src/services/adminService");
const { protect, restrictTo } = require("../src/middlewares/auth");
const User = require("../src/models/User");

// Mock environment variables
process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_EXPIRE = "7d";

// Mock mongoose
jest.mock("../src/models/User");

describe("Authentication Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Password Hashing", () => {
    test("should hash password with bcrypt", async () => {
      const password = "TestPass123";
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test("should verify correct password", async () => {
      const password = "TestPass123";
      const hashedPassword = await bcrypt.hash(password, 12);
      const isMatch = await bcrypt.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    test("should reject incorrect password", async () => {
      const password = "TestPass123";
      const wrongPassword = "WrongPass456";
      const hashedPassword = await bcrypt.hash(password, 12);
      const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });
  });

  describe("JWT Token Generation and Validation", () => {
    test("should generate valid JWT token", () => {
      const payload = {
        userId: "123456",
        email: "test@example.com",
        role: "user",
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    test("should verify valid JWT token", () => {
      const payload = {
        userId: "123456",
        email: "test@example.com",
        role: "user",
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test("should reject invalid JWT token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyToken(invalidToken)).toThrow("Invalid token");
    });

    test("should reject expired JWT token", () => {
      const payload = { userId: "123" };
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "0s",
      });

      // Wait a moment to ensure token expires
      setTimeout(() => {
        expect(() => verifyToken(expiredToken)).toThrow("Token has expired");
      }, 100);
    });

    test("should create token payload from user object", () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        email: "test@example.com",
        role: "admin",
      };

      const payload = createTokenPayload(user);

      expect(payload).toEqual({
        userId: user._id,
        email: user.email,
        role: user.role,
      });
    });
  });

  describe("User Signup", () => {
    test("should successfully create a new user", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "SecurePass123",
        fullName: "New User",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        ...userData,
        role: "user",
        status: "active",
        toSafeObject: jest.fn().mockReturnValue({
          _id: "507f1f77bcf86cd799439011",
          email: userData.email,
          fullName: userData.fullName,
          role: "user",
          status: "active",
        }),
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const result = await signup(userData);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalled();
    });

    test("should throw error if email already exists", async () => {
      const userData = {
        email: "existing@example.com",
        password: "SecurePass123",
        fullName: "Existing User",
      };

      User.findOne.mockResolvedValue({ email: userData.email });

      await expect(signup(userData)).rejects.toThrow(
        "Email already registered"
      );
    });
  });

  describe("Role-Based Middleware", () => {
    test("should allow admin role access", () => {
      const req = {
        user: { role: "admin" },
      };
      const res = {};
      const next = jest.fn();

      const middleware = restrictTo("admin");
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    test("should deny user role when admin required", () => {
      const req = {
        user: { role: "user" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = restrictTo("admin");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "You do not have permission to perform this action.",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test("should allow multiple roles", () => {
      const req = {
        user: { role: "user" },
      };
      const res = {};
      const next = jest.fn();

      const middleware = restrictTo("admin", "user");
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("User Activation/Deactivation", () => {
    test("should activate an inactive user", async () => {
      const userId = "507f1f77bcf86cd799439011";
      const mockUser = {
        _id: userId,
        email: "test@example.com",
        status: "inactive",
        save: jest.fn().mockResolvedValue(true),
        toSafeObject: jest.fn().mockReturnValue({
          _id: userId,
          email: "test@example.com",
          status: "active",
        }),
      };

      User.findById.mockResolvedValue(mockUser);

      const result = await activateUser(userId);

      expect(result).toBeDefined();
      expect(mockUser.status).toBe("active");
      expect(mockUser.save).toHaveBeenCalled();
    });

    test("should deactivate an active user", async () => {
      const userId = "507f1f77bcf86cd799439011";
      const adminId = "507f1f77bcf86cd799439012";
      const mockUser = {
        _id: userId,
        email: "test@example.com",
        status: "active",
        save: jest.fn().mockResolvedValue(true),
        toSafeObject: jest.fn().mockReturnValue({
          _id: userId,
          email: "test@example.com",
          status: "inactive",
        }),
      };

      User.findById.mockResolvedValue(mockUser);

      const result = await deactivateUser(userId, adminId);

      expect(result).toBeDefined();
      expect(mockUser.status).toBe("inactive");
      expect(mockUser.save).toHaveBeenCalled();
    });

    test("should prevent admin from deactivating themselves", async () => {
      const adminId = "507f1f77bcf86cd799439011";
      const mockUser = {
        _id: { toString: () => adminId },
        email: "admin@example.com",
        status: "active",
      };

      User.findById.mockResolvedValue(mockUser);

      await expect(deactivateUser(adminId, adminId)).rejects.toThrow(
        "You cannot deactivate your own account"
      );
    });

    test("should throw error if user not found for activation", async () => {
      User.findById.mockResolvedValue(null);

      await expect(activateUser("nonexistent")).rejects.toThrow(
        "User not found"
      );
    });
  });
});

describe("Integration Tests", () => {
  test("should complete full authentication flow", async () => {
    // 1. Hash password
    const password = "TestPass123";
    const hashedPassword = await bcrypt.hash(password, 12);
    expect(hashedPassword).toBeDefined();

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);

    // 3. Create token payload
    const user = {
      _id: "507f1f77bcf86cd799439011",
      email: "test@example.com",
      role: "user",
    };
    const payload = createTokenPayload(user);
    expect(payload.userId).toBe(user._id);

    // 4. Generate token
    const token = generateToken(payload);
    expect(token).toBeDefined();

    // 5. Verify token
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(user._id);
    expect(decoded.email).toBe(user.email);
  });
});
