const express = require("express");

const router = express.Router();

const Prediction = require("../models/Prediction");

router.get("/", async (req, res) => {

  const data = await Prediction.find().sort({
    _id: -1
  });

  res.json(data);
});

module.exports = router;