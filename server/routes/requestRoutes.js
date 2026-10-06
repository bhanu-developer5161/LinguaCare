const express = require("express");

const {
  createRequest,
  getEducatorRequests,
  getFamilyRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// INTEREST REQUESTS
router.post("/", createRequest);
router.get("/family", getFamilyRequests);
router.get("/educator", getEducatorRequests);
router.put("/:id/status", updateRequestStatus);

// MESSAGING
router.post("/:requestId/messages", sendMessage);
router.get("/:requestId/messages", getMessages);

module.exports = router;