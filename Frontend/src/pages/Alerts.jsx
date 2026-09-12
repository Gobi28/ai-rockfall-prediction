import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { acknowledgeAlert, getAlerts } from "../services/api";

const mines = ["MINE-I", "MINE-IA", "MINE-II"];

function Alerts() {
  const [mine, setMine] = useState(mines[0]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts(mine)
      .then((response) => setAlerts(response.data))
      .catch((error) => console.log(error));
  }, [mine]);

  const acknowledge = async (alertId) => {
    try {
      const response = await acknowledgeAlert(alertId);
      setAlerts((current) =>
        current.map((alert) => (alert._id === alertId ? response.data : alert)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openAlerts = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">INCIDENT MANAGEMENT / HIGH PRIORITY</p>
          <h1>Critical alert register</h1>
          <p className="muted">
            Review, acknowledge, and hand over incidents by mine unit
          </p>
        </div>
        <div className="alert-count">
          <FaBell /> <strong>{openAlerts}</strong> OPEN ALERTS
        </div>
      </div>
      <div className="mine-strip alert-mine-strip">
        <span className="strip-label">ALERT QUEUE</span>
        {mines.map((mineId) => (
          <button
            className={`mine-tab ${mine === mineId ? "selected" : ""}`}
            key={mineId}
            onClick={() => setMine(mineId)}
          >
            <strong>{mineId}</strong>
            <span>Scoped feed</span>
          </button>
        ))}
      </div>
      <div className="alert-summary">
        <div>
          <span className="summary-icon red">
            <FaExclamationTriangle />
          </span>
          <div>
            <small>OPEN CRITICAL EVENTS</small>
            <strong>{openAlerts}</strong>
          </div>
        </div>
        <div>
          <small>RESPONSE PROTOCOL</small>
          <strong>GEOTECHNICAL REVIEW</strong>
        </div>
        <div>
          <small>ACTIVE UNIT</small>
          <strong className="green-text">{mine}</strong>
        </div>
      </div>
      <article className="panel alert-register">
        <div className="panel-title">
          <div>
            <p className="eyebrow">{mine} / EVENT QUEUE</p>
            <h3>HIGH risk telemetry incidents</h3>
          </div>
          <span className="last-sync">Newest first</span>
        </div>
        {alerts.length ? (
          alerts.map((alert) => (
            <div
              className={`alert-row ${alert.acknowledged ? "acknowledged" : ""}`}
              key={alert._id}
            >
              <div className="alert-marker">
                <FaExclamationTriangle />
              </div>
              <div className="alert-main">
                <div>
                  <strong>Compound stability alert</strong>
                  <span className="risk-tag high">HIGH</span>
                </div>
                <p>
                  Moisture <b>{alert.input?.moisture}</b> · Vibration{" "}
                  <b>{alert.input?.vibration} PPV</b> · Slope{" "}
                  <b>{alert.input?.slope_angle}°</b> · Depth{" "}
                  <b>{alert.input?.depth}m</b>
                </p>
                <small>
                  {new Date(alert.time).toLocaleString()} · Confidence{" "}
                  {alert.confidence}%
                  {alert.acknowledgedAt
                    ? ` · Acknowledged ${new Date(alert.acknowledgedAt).toLocaleString()}`
                    : ""}
                </small>
              </div>
              <button
                className="ack-button"
                disabled={alert.acknowledged}
                onClick={() => acknowledge(alert._id)}
              >
                <FaCheck />{" "}
                {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            No high-risk incidents have been recorded for {mine}.
          </div>
        )}
      </article>
    </section>
  );
}

export default Alerts;
