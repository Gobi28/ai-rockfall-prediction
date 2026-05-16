import { useEffect, useState } from "react";
import { getPrediction } from "../services/api";

function Home() {

  const [data, setData] = useState(null);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const res = await getPrediction();

      setData(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div>

      <h1>AI Mine Dashboard</h1>

      {data && (

        <div className="dashboard-card">

          <h2>
            Current Risk:
            <span className={data.prediction.toLowerCase()}>
              {" "} {data.prediction}
            </span>
          </h2>

          <p>
            Confidence: {data.confidence}%
          </p>

          <p>
            Updated:
            {" "}
            {new Date(data.time).toLocaleString()}
          </p>

        </div>

      )}

    </div>
  );
}

export default Home;