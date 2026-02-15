const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
        maxlength: 200,
    },
}, { _id: false });

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        // Basic info (existing)
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: false,
        },
        age: {
            type: Number,
            required: false,
        },
        city: {
            type: String,
            required: false,
            index: true,
        },
        experienceLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: false,
        },
        goals: {
            type: [String],
            enum: ["cut", "bulk", "maintain", "strength", "endurance"],
            default: [],
        },
        preferredSplit: {
            type: String,
            required: false,
        },
        gymTime: {
            type: String,
            enum: ["morning", "afternoon", "evening", "night"],
            required: false,
        },
        bio: {
            type: String,
            maxlength: 300,
            required: false,
        },

        // Basic Social Info (new)
        displayName: {
            type: String,
            required: false,
            maxlength: 50,
        },
        avatarUrl: {
            type: String,
            required: false,
        },
        photos: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr) {
                    return arr.length <= 5;
                },
                message: "Maximum 5 photos allowed"
            }
        },

        // Gym Behavior (new)
        trainingStyle: {
            type: String,
            enum: ["bodybuilding", "powerlifting", "crossfit", "calisthenics", "general_fitness"],
            required: false,
        },
        yearsTraining: {
            type: Number,
            required: false,
            min: 0,
        },
        workoutDaysPerWeek: {
            type: Number,
            required: false,
            min: 1,
            max: 7,
        },
        preferredWorkoutDuration: {
            type: Number,
            required: false,
            min: 15,
        },

        // Schedule / Availability (new)
        availableDays: {
            type: [String],
            enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            default: [],
        },
        availableTimes: {
            type: [String],
            enum: ["morning", "afternoon", "evening", "night"],
            default: [],
        },

        // Personality & Social (new)
        prompts: {
            type: [promptSchema],
            default: [],
            validate: {
                validator: function (arr) {
                    return arr.length <= 5;
                },
                message: "Maximum 5 prompts allowed"
            }
        },

        // Preferences (new)
        lookingFor: {
            type: [String],
            enum: ["gym_partner", "accountability", "cardio_partner", "strength_partner", "beginner_help", "coach_like"],
            default: [],
        },
        musicTaste: {
            type: String,
            required: false,
            maxlength: 100,
        },
        dietType: {
            type: String,
            enum: ["veg", "nonveg", "vegan", "keto", "anything"],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Profile", profileSchema);
