const mongoose = require("mongoose");

const buddyRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: String,
            required: true,
        },
        toUserId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate requests
buddyRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.model("BuddyRequest", buddyRequestSchema);
