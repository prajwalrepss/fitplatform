const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const sessionsController = require("../controllers/sessions");

// All routes require authentication
router.use(verifyToken);

// Get all sessions for user
router.get("/", sessionsController.getAllSessions);

// Create new session
router.post("/", sessionsController.createSession);

// Get upcoming sessions
router.get("/upcoming", sessionsController.getUpcoming);

// Update session
router.put("/:id", sessionsController.updateSession);

// Delete session
router.delete("/:id", sessionsController.deleteSession);

// Mark session as completed
router.post("/:id/complete", sessionsController.completeSession);

module.exports = router;
