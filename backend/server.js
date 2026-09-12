const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontendUrl || process.env.NODE_ENV !== "production",
  }),
);

app.use(express.json());

app.use("/api/predict", require("./routes/predictRoutes"));

app.use("/api/history", require("./routes/historyRoutes"));

app.use("/api/alerts", require("./routes/alertRoutes"));

app.get("/", (req, res) => {
  res.send("AI Mine Backend Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
