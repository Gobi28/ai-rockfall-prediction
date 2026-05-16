import { useEffect, useState } from "react";

import { getAlerts } from "../services/api";

function Alerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    fetchAlerts();

  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await getAlerts();

      setAlerts(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div>

      <h1>HIGH Risk Alerts</h1>

      {alerts.map((alert, index) => (

        <div className="alert-card" key={index}>

          <h3>
            {alert.prediction} Risk
          </h3>

          <p>
            Confidence: {alert.confidence}%
          </p>

          <p>
            {new Date(alert.time).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  );
}

export default Alerts;