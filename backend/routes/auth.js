const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET, EXPIRES_IN } = require("../config/jwt");
const { verifyToken } = require("../middleware/auth");

// POST /auth/register
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password, age, height, weight, goal, experienceLevel } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const user = new User({ username, email, password, age, height, weight, goal, experienceLevel });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            SECRET,
            { expiresIn: EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            data: { token, userId: user._id, username: user.username },
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            SECRET,
            { expiresIn: EXPIRES_IN }
        );

        res.json({
            success: true,
            data: { token, userId: user._id, username: user.username },
            message: "Login successful",
        });
    } catch (error) {
        next(error);
    }
});

// GET /auth/me
router.get("/me", verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
