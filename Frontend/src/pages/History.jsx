import { useEffect, useState } from "react";
import { FaDownload, FaSearch } from "react-icons/fa";
import { getHistory } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getHistory()
      .then((response) => setHistory(response.data))
      .catch((error) => console.log(error));
  }, []);

  const filtered = history.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );
  const exportCsv = () => {
    const header =
      "time,rock_strength,moisture,vibration,slope_angle,depth,prediction,confidence\n";
    const body = filtered
      .map((item) =>
        [
          item.time,
          item.input?.rock_strength,
          item.input?.moisture,
          item.input?.vibration,
          item.input?.slope_angle,
          item.input?.depth,
          item.prediction,
          item.confidence,
        ].join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([header + body], { type: "text/csv" }),
    );
    link.download = "neyveli-prediction-history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">GEOTECHNICAL HISTORY / AUDIT LOG</p>
          <h1>Prediction history</h1>
          <p className="muted">
            Traceable model outputs and sensor conditions from the active shift
          </p>
        </div>
        <span className="history-total">{history.length} RECORDS LOADED</span>
      </div>
      <article className="panel history-panel full-history">
        <div className="panel-title">
          <div>
            <p className="eyebrow">TELEMETRY ARCHIVE</p>
            <h3>Readings and classifications</h3>
          </div>
          <div className="history-tools">
            <label>
              <FaSearch />
              <input
                placeholder="Search telemetry"
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
                <th>Slope angle</th>
                <th>Depth</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={`${item.time}-${index}`}>
                  <td>{new Date(item.time).toLocaleString()}</td>
                  <td>{item.input?.rock_strength} MPa</td>
                  <td>{item.input?.moisture} %</td>
                  <td>{item.input?.vibration} PPV</td>
                  <td>{item.input?.slope_angle}°</td>
                  <td>{item.input?.depth} m</td>
                  <td>{item.confidence}%</td>
                  <td>
                    <span
                      className={`risk-tag ${(item.prediction || "LOW").toLowerCase()}`}
                    >
                      {item.prediction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="empty-state">No records match this search.</div>
        )}
      </article>
    </section>
  );
}

export default History;
