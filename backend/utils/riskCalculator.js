const calculateRisk = (data) => {

  let score = 0;

  const rockStrength = Number(data.rock_strength);
  const moisture = Number(data.moisture);
  const vibration = Number(data.vibration);
  const slopeAngle = Number(data.slope_angle);
  const depth = Number(data.depth);

  // Weak rock
  if (rockStrength < 40)
    score += 30;

  // High moisture
  if (moisture > 0.7)
    score += 25;

  // High vibration
  if (vibration > 6)
    score += 20;

  // Dangerous slope
  if (slopeAngle > 45)
    score += 15;

  // Deep mine
  if (depth > 400)
    score += 10;

  let prediction = "LOW";

  if (score >= 70)
    prediction = "HIGH";

  else if (score >= 40)
    prediction = "MEDIUM";

  return {
    prediction,
    confidence: score
  };
};

module.exports = calculateRisk;