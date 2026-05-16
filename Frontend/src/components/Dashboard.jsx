function Dashboard({ data }) {
  if (!data) return null;

  return (
    <div className="dashboard">
      <h3>Sensor Data</h3>
      <p>Rock Strength: {data.rock_strength}</p>
      <p>Moisture: {data.moisture}</p>
      <p>Vibration: {data.vibration}</p>
      <p>Slope Angle: {data.slope_angle}</p>
      <p>Depth: {data.depth}</p>
    </div>
  );
}

export default Dashboard;
