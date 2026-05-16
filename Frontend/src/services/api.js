import axios from "axios";

const API = "http://localhost:5000/api";

export const getPrediction = () =>
  axios.get(`${API}/predict`);

export const getHistory = () =>
  axios.get(`${API}/history`);

export const getAlerts = () =>
  axios.get(`${API}/alerts`);