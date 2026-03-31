const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    goal: {
        type: String,
        enum: [
            "cut",
            "bulk",
            "maintain",
            "general_fitness",
            "muscle_gain",
            "fat_loss",
            "strength",
            "endurance"
        ],
        required: false,
    },
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
