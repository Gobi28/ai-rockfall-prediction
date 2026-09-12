const express = require("express");

const router = express.Router();

const Alert = require("../models/Alert");

router.get("/", async (req, res) => {
  const filter = req.query.mine ? { mine_id: req.query.mine } : {};
  const data = await Alert.find(filter).sort({ _id: -1 }).limit(100);

  res.json(data);
});

router.patch("/:id/acknowledge", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { acknowledged: true, acknowledgedAt: new Date() },
      { new: true },
    );

    if (!alert) return res.status(404).json({ error: "Alert not found" });

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
