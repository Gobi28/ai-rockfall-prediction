import { useEffect, useState } from "react";

import { getHistory } from "../services/api";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const res = await getHistory();

      setHistory(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div>

      <h1>Prediction History</h1>

      {history.map((item, index) => (

        <div className="history-card" key={index}>

          <h3>
            {item.prediction}
          </h3>

          <p>
            Confidence: {item.confidence}%
          </p>

          <p>
            {new Date(item.time).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  );
}

export default History;