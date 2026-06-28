const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET, EXPIRES_IN } = require("../config/jwt");

// POST /auth/register - Register new user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, age, height, weight, goal } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = new User({
            username,
            email,
            password,
            age,
            height,
            weight,
            goal,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
            username: user.username,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// POST /auth/login - Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare password using bcrypt
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
            },
            SECRET,
            { expiresIn: EXPIRES_IN }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
            username: user.username,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

module.exports = router;
