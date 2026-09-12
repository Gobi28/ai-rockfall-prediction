import { useEffect, useState } from "react";
import {
  FaClock,
  FaMountain,
  FaSignal,
  FaSyncAlt,
  FaTint,
  FaWaveSquare,
} from "react-icons/fa";
import { getPrediction } from "../services/api";

function LivePrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchPrediction = async () => {
      try {
        const response = await getPrediction();
        if (mounted) setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPrediction();
    const interval = setInterval(fetchPrediction, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const input = data?.input || {};
  const risk = data?.prediction || "WAITING";
  const riskClass = risk.toLowerCase();

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">LIVE TELEMETRY / SHIFT MONITOR</p>
          <h1>Real-time ground conditions</h1>
          <p className="muted">
            One-minute sampling interval across the active mine unit
          </p>
        </div>
        <span className="live-chip">
          <span className="pulse-dot" /> STREAM CONNECTED
        </span>
      </div>
      <div className="live-layout">
        <article className={`panel live-status-panel ${riskClass}`}>
          <div className="panel-title">
            <div>
              <p className="eyebrow">CURRENT ASSESSMENT</p>
              <h3>Operational risk status</h3>
            </div>
            <FaSignal className="panel-action" />
          </div>
          <div className="live-risk">
            <span className="risk-light" />
            <div>
              <small>MODEL CLASSIFICATION</small>
              <strong>{risk}</strong>
              <p>
                {data
                  ? `${data.confidence}% model confidence`
                  : "Awaiting first reading"}
              </p>
            </div>
          </div>
          <div className="live-time">
            <FaClock />{" "}
            {data
              ? new Date(data.time).toLocaleString()
              : "No reading received"}
          </div>
        </article>
        <article className="panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">SENSOR SNAPSHOT</p>
              <h3>Latest reading</h3>
            </div>
            <FaSyncAlt className="panel-action" />
          </div>
          <div className="sensor-grid">
            <div>
              <FaMountain />
              <span>ROCK STRENGTH</span>
              <strong>
                {input.rock_strength || "--"}
                <small> MPa</small>
              </strong>
            </div>
            <div>
              <FaTint />
              <span>MOISTURE</span>
              <strong>
                {input.moisture || "--"}
                <small> %</small>
              </strong>
            </div>
            <div>
              <FaWaveSquare />
              <span>VIBRATION</span>
              <strong>
                {input.vibration || "--"}
                <small> PPV</small>
              </strong>
            </div>
            <div>
              <FaMountain />
              <span>SLOPE / DEPTH</span>
              <strong>
                {input.slope_angle || "--"}
                <small>° / {input.depth || "--"}m</small>
              </strong>
            </div>
          </div>
        </article>
      </div>
      <div className="panel telemetry-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">SIGNAL HEALTH</p>
            <h3>Monitoring channels</h3>
          </div>
          <span className="last-sync">
            {loading ? "SYNCING" : "ALL CHANNELS NOMINAL"}
          </span>
        </div>
        <div className="signal-list">
          <div>
            <span>Rock mass strength</span>
            <i>
              <b style={{ width: "92%" }} />
            </i>
            <strong>92%</strong>
          </div>
          <div>
            <span>Moisture probe array</span>
            <i>
              <b className="amber-bar" style={{ width: "76%" }} />
            </i>
            <strong>76%</strong>
          </div>
          <div>
            <span>Vibration geophone</span>
            <i>
              <b style={{ width: "98%" }} />
            </i>
            <strong>98%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LivePrediction;
