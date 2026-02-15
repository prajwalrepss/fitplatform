const express = require("express");
const router = express.Router();

const muscles = require("../data/muscles");

router.get("/", (req, res) => {
  res.json(muscles);
});

module.exports = router;