const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const muscleController = require("../controllers/muscle");

// All muscle routes require authentication
router.use(verifyToken);

// GET /muscle?range=7d      — last 7 days (default)
// GET /muscle?range=today   — today only
// GET /muscle?range=30d     — last 30 days
// GET /muscle?range=all     — all time
router.get("/", muscleController.getMuscleData);

// Backward compatibility aliases
router.get("/data", muscleController.getMuscleData);
router.get("/today", (req, res, next) => {
    req.query.range = "today";
    muscleController.getMuscleData(req, res, next);
});

module.exports = router;
