import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export const getPrediction = (mine) =>
  axios.get(`${API}/predict`, { params: mine ? { mine } : {} });

export const getHistory = (mine) =>
  axios.get(`${API}/history`, { params: mine ? { mine } : {} });

export const getAlerts = (mine) =>
  axios.get(`${API}/alerts`, { params: mine ? { mine } : {} });

export const acknowledgeAlert = (alertId) =>
  axios.patch(`${API}/alerts/${alertId}/acknowledge`);
