const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../validators/schemas");
const { protect } = require("../middlewares/auth");

// Public routes
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);
router.post("/logout", protect, authController.logout);

module.exports = router;
