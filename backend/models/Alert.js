const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  time: {
    type: Date,
    expires: "90d",
  },

  mine_id: String,

  acknowledged: {
    type: Boolean,
    default: false,
  },

  acknowledgedAt: Date,

  input: Object,

  prediction: String,

  confidence: Number,
});

module.exports = mongoose.model("Alert", alertSchema);
