const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  time: {
    type: Date,
    expires: "30d",
  },

  mine_id: String,

  input: Object,

  prediction: String,

  confidence: Number,
});

module.exports = mongoose.model("Prediction", predictionSchema);
