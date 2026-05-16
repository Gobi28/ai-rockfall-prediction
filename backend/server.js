const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/predict",
  require("./routes/predictRoutes")
);

app.use("/api/history",
  require("./routes/historyRoutes")
);

app.use("/api/alerts",
  require("./routes/alertRoutes")
);

app.get("/", (req, res) => {
  res.send("AI Mine Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});