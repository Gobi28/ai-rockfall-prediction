import { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaBell,
  FaBolt,
  FaCheck,
  FaDownload,
  FaMountain,
  FaSearch,
  FaTint,
  FaWaveSquare,
} from "react-icons/fa";
import {
  acknowledgeAlert,
  getAlerts,
  getHistory,
  getPrediction,
} from "../services/api";

const mines = [
  { id: "MINE-I", capacity: "8 MTPA", focus: "Upper Cuddalore Sandstone" },
  { id: "MINE-IA", capacity: "7 MTPA", focus: "Soft Clay & Seepage Zones" },
  { id: "MINE-II", capacity: "13 MTPA", focus: "Deep Aquifer Boundary" },
];

const tabs = ["Overview", "Live alerts", "Risk matrix", "History"];

const riskClass = (risk = "LOW") => risk.toLowerCase();

const average = (rows, key) =>
  rows.length
    ? rows.reduce((sum, row) => sum + Number(row.input?.[key] || 0), 0) /
      rows.length
    : 0;

function Home() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [mineIndex, setMineIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [query, setQuery] = useState("");

  const mine = mines[mineIndex];

  useEffect(() => {
    Promise.all([
      getPrediction(mine.id),
      getHistory(mine.id),
      getAlerts(mine.id),
    ])
      .then(([prediction, historyResponse, alertResponse]) => {
        setData(prediction.data);
        setHistory(historyResponse.data);
        setAlerts(alertResponse.data);
      })
      .catch((error) => console.log(error));
  }, [mine.id]);

  const sourceRows = history.length ? history : data ? [data] : [];
  const rows = sourceRows;
  const latestInput = data?.input || {};
  const averageStrength =
    average(rows, "rock_strength") || Number(latestInput.rock_strength || 0);
  const averageMoisture =
    average(rows, "moisture") || Number(latestInput.moisture || 0);
  const peakVibration = rows.length
    ? Math.max(...rows.map((row) => Number(row.input?.vibration || 0)))
    : Number(latestInput.vibration || 0);
  const maxSlope = rows.length
    ? Math.max(...rows.map((row) => Number(row.input?.slope_angle || 0)))
    : Number(latestInput.slope_angle || 0);
  const riskRows = rows.filter((row) => row.prediction === "HIGH");
  const visibleRows = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase()),
  );
  const severity = (row) =>
    Math.round(
      Number(row.input?.moisture || 0) * 35 +
        Number(row.input?.vibration || 0) * 8 +
        Number(row.input?.slope_angle || 0) * 0.7,
    );

  const exportCsv = () => {
    const header =
      "time,rock_strength,moisture,vibration,slope_angle,depth,prediction\n";
    const body = visibleRows
      .map((row) =>
        [
          row.time,
          row.input?.rock_strength,
          row.input?.moisture,
          row.input?.vibration,
          row.input?.slope_angle,
          row.input?.depth,
          row.prediction,
        ].join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([header + body], { type: "text/csv" }),
    );
    link.download = `${mine.id.toLowerCase()}-telemetry.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const acknowledgeHomeAlert = async (alertId) => {
    try {
      const response = await acknowledgeAlert(alertId);
      setAlerts((current) =>
        current.map((alert) => (alert._id === alertId ? response.data : alert)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="control-room">
      <div className="command-header">
        <div>
          <p className="eyebrow">NLC INDIA LTD / NEYVELI LIGNITE MINES</p>
          <h1>Ground stability command center</h1>
          <p className="muted">
            Geotechnical telemetry, predictive risk, and shift oversight
          </p>
        </div>
        <div className="system-state">
          <span className="pulse-dot" /> LIVE SYSTEM <strong>●</strong>
        </div>
      </div>
      <div className="mine-strip">
        <span className="strip-label">ACTIVE UNIT</span>
        {mines.map((unit, index) => (
          <button
            className={`mine-tab ${mineIndex === index ? "selected" : ""}`}
            key={unit.id}
            onClick={() => setMineIndex(index)}
          >
            <strong>{unit.id}</strong>
            <span>{unit.capacity}</span>
          </button>
        ))}
        <div className="unit-focus">
          <FaMountain /> {mine.focus}
        </div>
      </div>
      <div className="view-tabs">
        {tabs.map((tab, index) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            <span>0{index + 1}</span>
            {tab}
          </button>
        ))}
      </div>
      <div className="view-heading">
        <div>
          <p className="eyebrow">
            {mine.id} / {activeTab.toUpperCase()}
          </p>
          <h2>
            {activeTab === "Overview" ? "Operational overview" : activeTab}
          </h2>
        </div>
        <span className="last-sync">
          Last sync{" "}
          {data ? new Date(data.time).toLocaleTimeString() : "--:--:--"}
        </span>
      </div>

      {activeTab === "Overview" && (
        <>
          <div className="kpi-grid">
            <article className="metric-card">
              <div className="metric-icon green">
                <FaMountain />
              </div>
              <p>AVG ROCK STRENGTH</p>
              <strong>
                {averageStrength.toFixed(1)} <small>MPa</small>
              </strong>
              <span className="trend positive">
                <FaArrowUp /> 4.8% vs. prior shift
              </span>
            </article>
            <article className="metric-card">
              <div className="metric-icon amber">
                <FaTint />
              </div>
              <p>MOISTURE LEVEL</p>
              <strong>
                {(averageMoisture * 100).toFixed(1)} <small>%</small>
              </strong>
              <div className="meter">
                <span
                  style={{ width: `${Math.min(100, averageMoisture * 100)}%` }}
                />
              </div>
              <span className="trend">Within operating band</span>
            </article>
            <article className="metric-card">
              <div className="metric-icon red">
                <FaWaveSquare />
              </div>
              <p>PEAK VIBRATION</p>
              <strong>
                {peakVibration.toFixed(2)} <small>PPV mm/s</small>
              </strong>
              <span className="trend warning">
                <FaArrowUp /> watch threshold 5.0
              </span>
            </article>
            <article className="metric-card">
              <div className="metric-icon blue">
                <FaBolt />
              </div>
              <p>MAX SLOPE / ACTIVE DEPTH</p>
              <strong>
                {maxSlope} <small>°</small> <em>/</em> {latestInput.depth || 0}{" "}
                <small>m</small>
              </strong>
              <span className="trend">Bench profile nominal</span>
            </article>
          </div>
          <div className="overview-grid">
            <article className="panel bench-panel">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">BENCH PROFILE</p>
                  <h3>Active pit cross-section</h3>
                </div>
                <span className="legend">
                  <i className="stable" /> stable <i className="watch" /> watch{" "}
                  <i className="critical" /> critical
                </span>
              </div>
              <svg
                className="bench-svg"
                viewBox="0 0 760 260"
                role="img"
                aria-label="Mine bench stability cross-section"
              >
                <path
                  className="ground"
                  d="M0 62 L120 62 L175 100 L280 100 L335 140 L455 140 L510 180 L640 180 L705 220 L760 220 L760 260 L0 260Z"
                />
                <path
                  className="bench-line stable-line"
                  d="M0 62 H120 L175 100 H280 L335 140 H455 L510 180 H640 L705 220 H760"
                />
                <path
                  className="bench-line watch-line"
                  d="M170 100 H280 M330 140 H455 M505 180 H640"
                />
                <path
                  className="water-line"
                  d="M40 215 C180 190 290 240 420 210 S650 205 750 230"
                />
                <text x="24" y="46">
                  SURFACE BENCH
                </text>
                <text x="500" y="247">
                  AQUIFER LINE
                </text>
              </svg>
              <div className="bench-footer">
                <span>
                  <b>Depth</b> {latestInput.depth || 0} m
                </span>
                <span>
                  <b>Material</b> {mine.focus}
                </span>
                <span className="status-text">
                  <i className="stable" /> Stability nominal
                </span>
              </div>
            </article>
            <article className="panel alert-panel">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">SHIFT WATCHLIST</p>
                  <h3>Risk posture</h3>
                </div>
                <FaBell className="panel-action" />
              </div>
              <div className={`risk-banner ${riskClass(data?.prediction)}`}>
                <span className="risk-light" />
                <div>
                  <small>CURRENT RISK LEVEL</small>
                  <strong>{data?.prediction || "WAITING"}</strong>
                </div>
                <b>
                  {data?.confidence || 0}%<small> confidence</small>
                </b>
              </div>
              <div className="watch-list">
                <div>
                  <span>Telemetry rows</span>
                  <strong>{sourceRows.length || 0}</strong>
                </div>
                <div>
                  <span>Critical incidents</span>
                  <strong className="red-text">{alerts.length}</strong>
                </div>
                <div>
                  <span>Current mine</span>
                  <strong>{mine.id}</strong>
                </div>
              </div>
            </article>
          </div>
        </>
      )}

      {activeTab === "Live alerts" && (
        <div className="content-grid">
          <article className="panel wide-panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">STREAMING FEED</p>
                <h3>Active telemetry incidents</h3>
              </div>
              <span className="live-chip">
                <span className="pulse-dot" /> monitoring
              </span>
            </div>
            {alerts.length ? (
              alerts.slice(0, 8).map((alert, index) => (
                <div
                  className={`incident-row ${alert.acknowledged ? "acknowledged" : ""}`}
                  key={`${alert._id || alert.time}-${index}`}
                >
                  <span className="incident-time">
                    {new Date(alert.time).toLocaleTimeString()}
                  </span>
                  <span className="severity-dot" />
                  <div>
                    <strong>Compound stability alert</strong>
                    <p>
                      Moisture {alert.input?.moisture} / Vibration{" "}
                      {alert.input?.vibration} / Slope{" "}
                      {alert.input?.slope_angle}°
                    </p>
                  </div>
                  <span className="risk-tag high">HIGH</span>
                  <button
                    className="ack-button"
                    disabled={alert.acknowledged}
                    onClick={() => acknowledgeHomeAlert(alert._id)}
                  >
                    <FaCheck />{" "}
                    {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No active HIGH incidents recorded for this shift.
              </div>
            )}
          </article>
        </div>
      )}

      {activeTab === "Risk matrix" && (
        <div className="content-grid">
          <article className="panel matrix-panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">PREDICTIVE RISK</p>
                <h3>Moisture / vibration correlation</h3>
              </div>
              <span className="risk-tag high">{riskRows.length} HIGH ROWS</span>
            </div>
            <div className="scatter">
              <span className="axis-y">MOISTURE %</span>
              <span className="axis-x">VIBRATION PPV mm/s</span>
              {riskRows.slice(0, 20).map((row, index) => (
                <i
                  key={index}
                  style={{
                    left: `${Math.min(94, (Number(row.input?.vibration || 0) / 6) * 100)}%`,
                    bottom: `${Math.min(92, Number(row.input?.moisture || 0) * 100)}%`,
                  }}
                />
              ))}
              <b className="threshold-v">5.0</b>
              <b className="threshold-m">70%</b>
            </div>
          </article>
          <article className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">PRIORITIZED LOG</p>
                <h3>Critical risk entries</h3>
              </div>
            </div>
            <div className="risk-log">
              {riskRows.slice(0, 6).map((row, index) => (
                <div className="risk-log-row" key={index}>
                  <span>#{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{row.input?.depth}m bench reading</strong>
                    <p>{new Date(row.time).toLocaleString()}</p>
                  </div>
                  <b>{severity(row)} SI</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}

      {activeTab === "History" && (
        <article className="panel history-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">GEOTECHNICAL ANALYTICS</p>
              <h3>Historical telemetry</h3>
            </div>
            <div className="history-tools">
              <label>
                <FaSearch />
                <input
                  placeholder="Search rows"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <button className="export-button" onClick={exportCsv}>
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Rock strength</th>
                  <th>Moisture</th>
                  <th>Vibration</th>
                  <th>Slope</th>
                  <th>Depth</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.slice(0, 20).map((row, index) => (
                  <tr key={`${row.time}-${index}`}>
                    <td>{new Date(row.time).toLocaleString()}</td>
                    <td>{row.input?.rock_strength} MPa</td>
                    <td>{row.input?.moisture}</td>
                    <td>{row.input?.vibration}</td>
                    <td>{row.input?.slope_angle}°</td>
                    <td>{row.input?.depth} m</td>
                    <td>
                      <span className={`risk-tag ${riskClass(row.prediction)}`}>
                        {row.prediction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </section>
  );
}

export default Home;
