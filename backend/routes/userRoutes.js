const express = require("express");
const router = express.Router();

// Get current user (MongoDB user)
router.get("/me", async (req, res) => {
    try {
        // req.user is set by syncUser middleware
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

module.exports = router;
