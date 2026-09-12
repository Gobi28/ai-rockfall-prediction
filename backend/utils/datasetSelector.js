const readCSV = require("./readCSV");

const mineIds = ["MINE-I", "MINE-IA", "MINE-II"];

const getCurrentData = async (requestedMine) => {
  const data = await readCSV();

  const elapsedSeconds = Math.floor(Date.now() / 1000);

  const mineIndex = Math.max(0, mineIds.indexOf(requestedMine));
  const mineRows = data.filter(
    (_, index) => index % mineIds.length === mineIndex,
  );
  const index = elapsedSeconds % mineRows.length;

  const row = mineRows[index];

  // REMOVE label column
  delete row.label;

  return {
    mine_id: mineIds[mineIndex],
    input: {
      rock_strength: Number(row.rock_strength),
      moisture: Number(row.moisture),
      vibration: Number(row.vibration),
      slope_angle: Number(row.slope_angle),
      depth: Number(row.depth),
    },
  };
};

module.exports = getCurrentData;
