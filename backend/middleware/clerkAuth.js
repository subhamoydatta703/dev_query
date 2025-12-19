const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/user');

// Helper function to generate random 4-character alphanumeric userId
function generateUserId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = 'user_';
    for (let i = 0; i < 4; i++) {
        // this loop is used to scaleup the userid numbers further if needed
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

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

            // ONLY check for existing user if email is present and not empty
            let existingUser = null;
            if (email && email.trim() !== "") {
                existingUser = await User.findOne({ email: email });
            }

            if (existingUser) {
                console.log("Found existing user by email, linking Clerk ID");
                // Link Clerk ID to existing user
                existingUser.clerkId = userId;

                // Generate userId if not already set
                if (!existingUser.userId) {
                    let newUserId;
                    let attempts = 0;
                    const maxAttempts = 10;

                    // Retry logic in case of collision
                    while (attempts < maxAttempts) {
                        newUserId = generateUserId();
                        const collision = await User.findOne({ userId: newUserId });
                        if (!collision) break;
                        attempts++;
                    }

                    existingUser.userId = newUserId;
                    console.log("Generated userId:", newUserId);
                }

                await existingUser.save();
                user = existingUser;
            } else {
                console.log("Creating brand new user");

                // Generate unique userId
                let newUserId;
                let attempts = 0;
                const maxAttempts = 10;

                while (attempts < maxAttempts) {
                    newUserId = generateUserId();
                    const collision = await User.findOne({ userId: newUserId });
                    if (!collision) break;
                    attempts++;
                }

                console.log("Generated userId:", newUserId);

                // Use the short userId as the username if no specific username provided or if it's auto-generated
                let finalUsername = username;
                // If username was auto-generated (starts with user_ and derives from Clerk ID), use the short ID instead
                if (!sessionClaims?.username || finalUsername.startsWith('user_')) {
                    finalUsername = newUserId;
                }

                // Create new user
                user = new User({
                    clerkId: userId,
                    userId: newUserId,
                    email: email,
                    username: finalUsername
                });
                await user.save();
                console.log("New user created successfully");
            }
        } else if (!user.userId) {
            // Existing user doesn't have userId yet, generate one
            let newUserId;
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                newUserId = generateUserId();
                const collision = await User.findOne({ userId: newUserId });
                if (!collision) break;
                attempts++;
            }

            user.userId = newUserId;
            await user.save();
            console.log("Assigned userId to existing user:", newUserId);
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
