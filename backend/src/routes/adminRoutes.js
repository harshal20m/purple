const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/auth");

// All routes require authentication and admin role
router.use(protect, restrictTo("admin"));

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id/activate", adminController.activateUser);
router.patch("/users/:id/deactivate", adminController.deactivateUser);

module.exports = router;
