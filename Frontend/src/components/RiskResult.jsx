
function RiskResult({ data }) {
  if (!data) return null;

  return (
    <div className="risk-card">
      <h3>Risk Level: 
        <span className={data.risk_level === "HIGH" ? "high" : "safe"}>
          {data.risk_level}
        </span>
      </h3>
      <p>Confidence: {(data.confidence * 100).toFixed(2)}%</p>
      <p>Timestamp: {data.timestamp}</p>
    </div>
  );
}

export default RiskResult;
