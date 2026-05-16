const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  time: String,

  input: Object,

  prediction: String,

  confidence: Number
});

module.exports = mongoose.model(
  "Alert",
  alertSchema
);