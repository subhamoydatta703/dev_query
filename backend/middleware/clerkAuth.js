const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/user');

// 1. Clerk Authentication Middleware
const requireAuth = ClerkExpressRequireAuth({
    // options if needed
});

// 2. User Synchronization Middleware
// This runs AFTER Clerk has verified the token and attached 'auth' to the request.
const syncUser = async (req, res, next) => {
    try {
        const { userId, sessionClaims } = req.auth;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - No Clerk ID" });
        }

        // Check if user exists in DB
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            const email = sessionClaims?.email || "";
            const username = sessionClaims?.username || `user_${userId.substr(0, 8)}`;

            // Check if user exists with this email (legacy user)
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                // Link Clerk ID to existing user
                existingUser.clerkId = userId;
                await existingUser.save();
                user = existingUser;
            } else {
                // Create new user
                user = new User({
                    clerkId: userId,
                    email: email,
                    username: username
                });
                await user.save();
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("User sync error:", error);
        res.status(500).json({ message: "Server Error during User Sync" });
    }
};

module.exports = { requireAuth, syncUser };
