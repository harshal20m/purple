const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validate = require("../middlewares/validate");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/schemas");
const { protect } = require("../middlewares/auth");

// All routes require authentication
router.use(protect);

router.get("/profile", userController.getProfile);
router.put(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile
);
router.put(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword
);

module.exports = router;
