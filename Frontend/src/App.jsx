import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout from "./Layout";

import Home from "./pages/Home";
import LivePrediction from "./pages/LivePrediction";
import Alerts from "./pages/Alerts";
import History from "./pages/History";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<LivePrediction />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  );
}

export default App;