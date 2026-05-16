const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");

const getCurrentData = require("../utils/datasetSelector");

const runPrediction = require("../services/pythonService");

const getPrediction = async (req, res) => {

  try {

    const input = await getCurrentData();

    // REAL AI prediction
    const result = await runPrediction(input);

    const predictionData = {

      time: new Date(),

      input,

      prediction: result.prediction,

      confidence: result.confidence
    };

    // Store history
    await Prediction.create(predictionData);

    // Store alerts
    if (result.prediction === "HIGH") {

      await Alert.create(predictionData);

    }

    res.json(predictionData);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getPrediction
};