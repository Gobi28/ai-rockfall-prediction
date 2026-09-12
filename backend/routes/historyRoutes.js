const express = require("express");

const router = express.Router();

const Prediction = require("../models/Prediction");

router.get("/", async (req, res) => {
  const filter = req.query.mine ? { mine_id: req.query.mine } : {};
  const data = await Prediction.find(filter).sort({ _id: -1 }).limit(100);

  res.json(data);
});

module.exports = router;
