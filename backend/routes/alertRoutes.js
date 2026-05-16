const express = require("express");

const router = express.Router();

const Alert = require("../models/Alert");

router.get("/", async (req, res) => {

  const data = await Alert.find().sort({
    _id: -1
  });

  res.json(data);
});

module.exports = router;