const path = require("path");
const { spawn } = require("child_process");
const readline = require("readline");

const python = spawn(
  process.env.PYTHON_PATH || "python",
  ["-u", path.join(__dirname, "..", "ml", "predict.py")],
  { cwd: path.join(__dirname, "..") },
);

const output = readline.createInterface({ input: python.stdout });
const pending = [];

output.on("line", (line) => {
  const request = pending.shift();
  if (!request) return;

  try {
    const result = JSON.parse(line);
    if (result.error) request.reject(new Error(result.error));
    else request.resolve(result);
  } catch (error) {
    request.reject(error);
  }
});

python.on("error", (error) => {
  while (pending.length) pending.shift().reject(error);
});

python.on("exit", (code) => {
  const error = new Error(`Python prediction process exited with code ${code}`);
  while (pending.length) pending.shift().reject(error);
});

const runPrediction = (data) =>
  new Promise((resolve, reject) => {
    pending.push({ resolve, reject });
    python.stdin.write(`${JSON.stringify(data)}\n`);
  });

module.exports = runPrediction;
