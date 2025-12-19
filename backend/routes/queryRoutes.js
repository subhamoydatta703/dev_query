const express = require("express");
const router = express.Router();
const Query = require("../models/query");
const User = require("../models/user");

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
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
