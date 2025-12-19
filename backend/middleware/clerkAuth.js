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
            // Create new user if first time
            // fallback to email from session claims or empty if not present yet
            // Note: Clerk session claims usually have email if configured.
            const email = sessionClaims?.email || "";
            const username = sessionClaims?.username || `user_${userId.substr(0, 8)}`;

            user = new User({
                clerkId: userId,
                email: email, // Might need to be updated via webhook for accuracy
                username: username
            });
            await user.save();
        }

        req.user = user; // Attach Mongo User to request
        next();
    } catch (error) {
        console.error("User sync error:", error);
        res.status(500).json({ message: "Server Error during User Sync" });
    }
};

module.exports = { requireAuth, syncUser };
