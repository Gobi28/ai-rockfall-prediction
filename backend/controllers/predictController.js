const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");

const getCurrentData = require("../utils/datasetSelector");

const runPrediction = require("../services/pythonService");

const HEARTBEAT_MS = 5 * 60 * 1000;
const mineState = new Map();

const getPrediction = async (req, res) => {
  try {
    const { mine_id, input } = await getCurrentData(req.query.mine);

    // REAL AI prediction
    const result = await runPrediction(input);

    const predictionData = {
      time: new Date(),

      mine_id,

      input,

      prediction: result.prediction,

      confidence: result.confidence,
    };

    const previousState = mineState.get(mine_id) || {
      prediction: undefined,
      savedAt: 0,
    };
    const riskChanged = result.prediction !== previousState.prediction;
    const heartbeatDue = Date.now() - previousState.savedAt >= HEARTBEAT_MS;
    const shouldSave =
      riskChanged || heartbeatDue || result.prediction === "HIGH";
    const enteringHighRisk =
      result.prediction === "HIGH" && previousState.prediction !== "HIGH";

    if (shouldSave) {
      const writes = [Prediction.create(predictionData)];

      if (enteringHighRisk) {
        writes.push(Alert.create(predictionData));
      }

      await Promise.all(writes);
      previousState.savedAt = Date.now();
    }

    mineState.set(mine_id, {
      prediction: result.prediction,
      savedAt: previousState.savedAt,
    });

    res.json(predictionData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getPrediction,
};
