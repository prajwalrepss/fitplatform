const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const BuddyRequest = require("../models/BuddyRequest");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// Apply authentication middleware to all buddy routes
router.use(verifyToken);

// POST /buddy/profile - Create or update profile
router.post("/profile", async (req, res) => {
    try {
        const userId = req.userId;
        const { gender, age, city, experienceLevel, goals, preferredSplit, gymTime, bio } = req.body;

        // Upsert: update if exists, create if not
        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                userId,
                gender,
                age,
                city,
                experienceLevel,
                goals,
                preferredSplit,
                gymTime,
                bio,
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({
            message: "Profile saved successfully",
            profile,
        });
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// GET /buddy/profile/me - Get own profile
router.get("/profile/me", async (req, res) => {
    try {
        const userId = req.userId;

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found. Create one first." });
        }

        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// GET /buddy/discover - Find similar gym buddies
router.get("/discover", async (req, res) => {
    try {
        const userId = req.userId;

        // Get current user's profile
        const myProfile = await Profile.findOne({ userId });

        if (!myProfile) {
            return res.status(400).json({
                error: "Create your profile first to discover buddies"
            });
        }

        // Get all requests involving this user
        const myRequests = await BuddyRequest.find({
            $or: [{ fromUserId: userId }, { toUserId: userId }],
        });

        // Extract user IDs to exclude
        const excludeUserIds = new Set([userId]); // Exclude self

        myRequests.forEach(req => {
            excludeUserIds.add(req.fromUserId);
            excludeUserIds.add(req.toUserId);
        });

        // Find potential matches with basic filters
        let query = { userId: { $nin: Array.from(excludeUserIds) } };

        // Filter by city if specified
        if (myProfile.city) {
            query.city = myProfile.city;
        }

        const candidates = await Profile.find(query);

        // Score each candidate
        const scoredCandidates = candidates.map(candidate => {
            let score = 0;

            // +2 same city
            if (candidate.city && candidate.city === myProfile.city) {
                score += 2;
            }

            // +2 same gym time
            if (candidate.gymTime && candidate.gymTime === myProfile.gymTime) {
                score += 2;
            }

            // +1 same experience level
            if (candidate.experienceLevel && candidate.experienceLevel === myProfile.experienceLevel) {
                score += 1;
            }

            // +1 per shared goal
            if (candidate.goals && myProfile.goals) {
                const sharedGoals = candidate.goals.filter(g => myProfile.goals.includes(g));
                score += sharedGoals.length;
            }

            // +1 same training style
            if (candidate.trainingStyle && candidate.trainingStyle === myProfile.trainingStyle) {
                score += 1;
            }

            // +1 overlap available days
            if (candidate.availableDays && myProfile.availableDays &&
                candidate.availableDays.length > 0 && myProfile.availableDays.length > 0) {
                const sharedDays = candidate.availableDays.filter(d => myProfile.availableDays.includes(d));
                if (sharedDays.length > 0) {
                    score += 1;
                }
            }

            // +1 overlap lookingFor
            if (candidate.lookingFor && myProfile.lookingFor &&
                candidate.lookingFor.length > 0 && myProfile.lookingFor.length > 0) {
                const sharedLookingFor = candidate.lookingFor.filter(l => myProfile.lookingFor.includes(l));
                if (sharedLookingFor.length > 0) {
                    score += 1;
                }
            }

            return {
                userId: candidate.userId,
                displayName: candidate.displayName,
                avatarUrl: candidate.avatarUrl,
                bio: candidate.bio,
                city: candidate.city,
                gymTime: candidate.gymTime,
                goals: candidate.goals,
                trainingStyle: candidate.trainingStyle,
                matchScore: score,
            };
        });

        // Sort by score descending and limit to top 20
        scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
        const topMatches = scoredCandidates.slice(0, 20);

        // Fetch usernames for the matches
        const userIds = topMatches.map(m => m.userId);
        const users = await User.find({ _id: { $in: userIds } }).select('username');

        // Map usernames to profiles
        const usernameMap = {};
        users.forEach(u => {
            usernameMap[u._id.toString()] = u.username;
        });

        const enrichedMatches = topMatches.map(match => ({
            ...match,
            username: usernameMap[match.userId] || "Unknown",
        }));

        res.json({
            count: enrichedMatches.length,
            matches: enrichedMatches,
        });
    } catch (error) {
        console.error("Error discovering buddies:", error);
        res.status(500).json({ error: "Failed to discover buddies" });
    }
});

// POST /buddy/request/:userId - Send buddy request
router.post("/request/:userId", async (req, res) => {
    try {
        const fromUserId = req.userId;
        const toUserId = req.params.userId;

        // Validate: cannot request self
        if (fromUserId === toUserId) {
            return res.status(400).json({ error: "Cannot send buddy request to yourself" });
        }

        // Check if target user exists
        const targetUser = await User.findById(toUserId);
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if request already exists (in either direction)
        const existingRequest = await BuddyRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({
                error: "Buddy request already exists between these users"
            });
        }

        // Create new request
        const request = new BuddyRequest({
            fromUserId,
            toUserId,
            status: "pending",
        });

        await request.save();

        res.status(201).json({
            message: "Buddy request sent successfully",
            request,
        });
    } catch (error) {
        console.error("Error sending buddy request:", error);
        res.status(500).json({ error: "Failed to send buddy request" });
    }
});

// POST /buddy/accept/:requestId - Accept buddy request
router.post("/accept/:requestId", async (req, res) => {
    try {
        const userId = req.userId;
        const requestId = req.params.requestId;

        // Find request
        const request = await BuddyRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: "Buddy request not found" });
        }

        // Verify user is the recipient
        if (request.toUserId !== userId) {
            return res.status(403).json({ error: "You can only accept requests sent to you" });
        }

        // Update status
        request.status = "accepted";
        await request.save();

        res.json({
            message: "Buddy request accepted",
            request,
        });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ error: "Failed to accept buddy request" });
    }
});

// POST /buddy/reject/:requestId - Reject buddy request
router.post("/reject/:requestId", async (req, res) => {
    try {
        const userId = req.userId;
        const requestId = req.params.requestId;

        // Find request
        const request = await BuddyRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: "Buddy request not found" });
        }

        // Verify user is the recipient
        if (request.toUserId !== userId) {
            return res.status(403).json({ error: "You can only reject requests sent to you" });
        }

        // Update status
        request.status = "rejected";
        await request.save();

        res.json({
            message: "Buddy request rejected",
            request,
        });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ error: "Failed to reject buddy request" });
    }
});

// GET /buddy/requests - Get incoming pending requests
router.get("/requests", async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await BuddyRequest.find({
            toUserId: userId,
            status: "pending",
        }).sort({ createdAt: -1 });

        // Fetch sender details
        const senderIds = requests.map(r => r.fromUserId);
        const senders = await User.find({ _id: { $in: senderIds } }).select('username');
        const profiles = await Profile.find({ userId: { $in: senderIds } });

        // Create lookup maps
        const usernameMap = {};
        const profileMap = {};

        senders.forEach(s => {
            usernameMap[s._id.toString()] = s.username;
        });

        profiles.forEach(p => {
            profileMap[p.userId] = p;
        });

        // Enrich requests
        const enrichedRequests = requests.map(req => ({
            ...req.toObject(),
            senderUsername: usernameMap[req.fromUserId] || "Unknown",
            senderProfile: profileMap[req.fromUserId] || null,
        }));

        res.json({
            count: enrichedRequests.length,
            requests: enrichedRequests,
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Failed to fetch buddy requests" });
    }
});

// GET /buddy/list - Get all accepted buddies
router.get("/list", async (req, res) => {
    try {
        const userId = req.userId;

        const acceptedRequests = await BuddyRequest.find({
            $or: [{ fromUserId: userId }, { toUserId: userId }],
            status: "accepted",
        });

        // Extract buddy user IDs
        const buddyIds = acceptedRequests.map(req =>
            req.fromUserId === userId ? req.toUserId : req.fromUserId
        );

        // Fetch buddy details
        const buddies = await User.find({ _id: { $in: buddyIds } }).select('username');
        const profiles = await Profile.find({ userId: { $in: buddyIds } });

        // Create lookup maps
        const usernameMap = {};
        const profileMap = {};

        buddies.forEach(b => {
            usernameMap[b._id.toString()] = b.username;
        });

        profiles.forEach(p => {
            profileMap[p.userId] = p;
        });

        // Build buddy list
        const buddyList = buddyIds.map(buddyId => ({
            userId: buddyId,
            username: usernameMap[buddyId] || "Unknown",
            profile: profileMap[buddyId] || null,
        }));

        res.json({
            count: buddyList.length,
            buddies: buddyList,
        });
    } catch (error) {
        console.error("Error fetching buddy list:", error);
        res.status(500).json({ error: "Failed to fetch buddy list" });
    }
});

// PUT /buddy/profile/details - Update extended profile fields
router.put("/profile/details", async (req, res) => {
    try {
        const userId = req.userId;
        const {
            displayName,
            avatarUrl,
            photos,
            bio,
            trainingStyle,
            yearsTraining,
            workoutDaysPerWeek,
            preferredWorkoutDuration,
            availableDays,
            availableTimes,
            prompts,
            lookingFor,
            musicTaste,
            dietType,
        } = req.body;

        // Validate photos length
        if (photos && photos.length > 5) {
            return res.status(400).json({ error: "Maximum 5 photos allowed" });
        }

        // Validate prompts length
        if (prompts && prompts.length > 5) {
            return res.status(400).json({ error: "Maximum 5 prompts allowed" });
        }

        // Validate bio length
        if (bio && bio.length > 300) {
            return res.status(400).json({ error: "Bio must be 300 characters or less" });
        }

        // Find and update profile
        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    displayName,
                    avatarUrl,
                    photos,
                    bio,
                    trainingStyle,
                    yearsTraining,
                    workoutDaysPerWeek,
                    preferredWorkoutDuration,
                    availableDays,
                    availableTimes,
                    prompts,
                    lookingFor,
                    musicTaste,
                    dietType,
                },
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({
            message: "Profile details updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Error updating profile details:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to update profile details" });
    }
});

// GET /buddy/profile/:userId - Get public profile of another user
router.get("/profile/:userId", async (req, res) => {
    try {
        const targetUserId = req.params.userId;

        // Find profile
        const profile = await Profile.findOne({ userId: targetUserId });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Get username
        const user = await User.findById(targetUserId).select('username');

        // Return only public fields
        const publicProfile = {
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            photos: profile.photos,
            bio: profile.bio,
            prompts: profile.prompts,
            city: profile.city,
            age: profile.age,
            experienceLevel: profile.experienceLevel,
            goals: profile.goals,
            trainingStyle: profile.trainingStyle,
            yearsTraining: profile.yearsTraining,
            workoutDaysPerWeek: profile.workoutDaysPerWeek,
            preferredWorkoutDuration: profile.preferredWorkoutDuration,
            gymTime: profile.gymTime,
            lookingFor: profile.lookingFor,
            musicTaste: profile.musicTaste,
            dietType: profile.dietType,
            username: user ? user.username : "Unknown",
        };

        res.json(publicProfile);
    } catch (error) {
        console.error("Error fetching public profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// GET /buddy/prompts/default - Get default prompt questions
router.get("/prompts/default", async (req, res) => {
    try {
        const defaultPrompts = [
            "My favorite exercise is",
            "My PR I'm proud of",
            "Gym pet peeve",
            "Looking for a partner who",
            "My typical workout time is",
            "Fun fact about me",
            "My fitness goal for this year",
            "Biggest gym achievement",
            "What motivates me to train",
            "My go-to post-workout meal",
        ];

        res.json({
            prompts: defaultPrompts,
        });
    } catch (error) {
        console.error("Error fetching default prompts:", error);
        res.status(500).json({ error: "Failed to fetch default prompts" });
    }
});

module.exports = router;
