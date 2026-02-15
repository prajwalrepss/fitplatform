const express = require("express");
const router = express.Router();

const splits = require("../data/splits");

// GET /splits - return all splits
router.get("/", (req, res) => {
    try {
        res.json(splits);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve splits" });
    }
});

// GET /splits/:id - return specific split
router.get("/:id", (req, res) => {
    try {
        const split = splits.find(s => s.id === req.params.id);

        if (!split) {
            return res.status(404).json({ error: "Split not found" });
        }

        res.json(split);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve split" });
    }
});

module.exports = router;
