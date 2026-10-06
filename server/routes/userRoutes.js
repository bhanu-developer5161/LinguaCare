const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  getEducators,
  getEducatorById,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC EDUCATOR ROUTES
// ==========================================

router.get("/educators", getEducators);

router.get("/educators/:id", getEducatorById);

// ==========================================
// PROTECTED USER ROUTES
// ==========================================

router.use(protect);

// Current user's profile
router.get("/me", getMyProfile);

router.put("/me", updateMyProfile);

module.exports = router;