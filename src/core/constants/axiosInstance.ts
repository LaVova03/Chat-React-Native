import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://64980a639543ce0f49e198cf.mockapi.io/Products",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const SERVER_URL = 'http://localhost:8080';
