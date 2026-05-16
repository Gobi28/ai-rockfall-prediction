const { PythonShell } = require("python-shell");

const runPrediction = (data) => {

  return new Promise((resolve, reject) => {

    let options = {

      mode: "text",

      pythonOptions: ["-u"],

      scriptPath: "./ml",

      args: [JSON.stringify(data)]
    };

    PythonShell.run(
      "predict.py",
      options
    )

    .then((results) => {

      const result = JSON.parse(results[0]);

      resolve(result);

    })

    .catch((err) => {

      reject(err);

    });

  });

};

module.exports = runPrediction;