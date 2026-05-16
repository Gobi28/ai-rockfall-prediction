const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  time: String,

  input: Object,

  prediction: String,

  confidence: Number
});

module.exports = mongoose.model(
  "Prediction",
  predictionSchema
);