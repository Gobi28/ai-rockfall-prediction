import { useEffect, useState } from "react";

import { getPrediction } from "../services/api";

function LivePrediction() {

  const [data, setData] = useState(null);

  const fetchPrediction = async () => {

    try {

      const res = await getPrediction();

      setData(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchPrediction();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {

      fetchPrediction();

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div>

      <h1>Live Prediction</h1>

      {data && (

        <div className="card">

          <h2>
            Risk Level: {data.prediction}
          </h2>

          <p>
            Confidence: {data.confidence}%
          </p>

          <p>
            Time: {new Date(data.time).toLocaleString()}
          </p>

        </div>

      )}

    </div>
  );
}

export default LivePrediction;