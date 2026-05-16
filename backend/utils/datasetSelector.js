const readCSV = require("./readCSV");

const getCurrentData = async () => {

  const data = await readCSV();

  const second = new Date().getSeconds();

  const index = second % data.length;

  const row = data[index];

  // REMOVE label column
  delete row.label;

  return {
    rock_strength: Number(row.rock_strength),
    moisture: Number(row.moisture),
    vibration: Number(row.vibration),
    slope_angle: Number(row.slope_angle),
    depth: Number(row.depth)
  };
};

module.exports = getCurrentData;