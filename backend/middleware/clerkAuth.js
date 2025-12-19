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
        console.log("=== User Sync Started ===");
        console.log("Auth object:", req.auth);

        const { userId, sessionClaims } = req.auth;

        if (!userId) {
            console.error("No userId in req.auth");
            return res.status(401).json({ message: "Unauthorized - No Clerk ID" });
        }

        console.log("Clerk userId:", userId);
        console.log("Session claims:", sessionClaims);

        // Check if user exists in DB
        let user = await User.findOne({ clerkId: userId });
        console.log("Existing user found:", !!user);

        if (!user) {
            const email = sessionClaims?.email || "";
            const username = sessionClaims?.username || `user_${userId.substring(0, 8)}`;

            console.log("Creating new user with email:", email, "username:", username);

            // Check if user exists with this email (legacy user)
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                console.log("Found existing user by email, linking Clerk ID");
                // Link Clerk ID to existing user
                existingUser.clerkId = userId;
                await existingUser.save();
                user = existingUser;
            } else {
                console.log("Creating brand new user");
                // Create new user
                user = new User({
                    clerkId: userId,
                    email: email,
                    username: username
                });
                await user.save();
                console.log("New user created successfully");
            }
        }

        console.log("Final user object:", user);
        req.user = user;
        console.log("=== User Sync Completed ===");
        next();
    } catch (error) {
        console.error("=== User Sync Error ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Server Error during User Sync", error: error.message });
    }
};

module.exports = { requireAuth, syncUser };
