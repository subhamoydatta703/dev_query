const express = require("express");
const router = express.Router();
const Answer = require("../models/answer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_123";

// Middleware to check auth
const requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) throw new Error();
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Get answers for a query
router.get("/:queryId/answers", async (req, res) => {
    try {
        const answers = await Answer.find({ query: req.params.queryId }).populate("author", "username").sort({ createdAt: 1 });
        res.json(answers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching answers" });
    }
});

// Create answer
router.post("/:queryId/answers", requireAuth, async (req, res) => {
    try {
        const { content } = req.body;
        const answer = new Answer({
            content,
            query: req.params.queryId,
            author: req.user._id,
        });
        await answer.save();
        // Populate author before sending back
        await answer.populate("author", "username");
        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ message: "Error creating answer" });
    }
});

// Delete answer - route is now relative to /api/queries
router.delete("/:queryId/answers/:id", requireAuth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }
        if (answer.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Answer.findByIdAndDelete(req.params.id);
        res.json({ message: "Answer deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting answer" });
    }
});

module.exports = router;
