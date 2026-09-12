const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const readCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(
      path.join(__dirname, "..", "data", "processed_data.csv"),
    )
      .pipe(csv())

      .on("data", (data) => results.push(data))

      .on("end", () => {
        resolve(results);
      })

      .on("error", (error) => {
        reject(error);
      });
  });
};

module.exports = readCSV;
