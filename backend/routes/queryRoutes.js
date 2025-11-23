const express = require("express");
const router = express.Router();
const Query = require("../models/query");
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

// Get all queries
router.get("/", async (req, res) => {
    try {
        const queries = await Query.find().populate("author", "username").sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching queries" });
    }
});

// Get single query
router.get("/:id", async (req, res) => {
    try {
        const query = await Query.findById(req.params.id).populate("author", "username");
        if (!query) {
            return res.status(404).json({ message: "Query not found" });
        }
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: "Error fetching query" });
    }
});

// Create query
router.post("/", requireAuth, async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const query = new Query({
            title,
            description,
            tags,
            author: req.user._id,
        });
        await query.save();
        res.status(201).json(query);
    } catch (error) {
        res.status(500).json({ message: "Error creating query" });
    }
});

// Update query
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) {
            return res.status(404).json({ message: "Query not found" });
        }
        if (query.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, description, tags } = req.body;
        query.title = title || query.title;
        query.description = description || query.description;
        query.tags = tags || query.tags;

        await query.save();
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: "Error updating query" });
    }
});

// Delete query
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) {
            return res.status(404).json({ message: "Query not found" });
        }
        if (query.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Query.findByIdAndDelete(req.params.id);
        res.json({ message: "Query deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting query" });
    }
});

module.exports = router;
