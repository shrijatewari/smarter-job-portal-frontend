// src/config.js
const isDevelopment = process.env.NODE_ENV === 'development';
export const BACKEND_URL = "https://smarter-job-portal-backend.onrender.com";
export const API_BASE = process.env.REACT_APP_API_BASE || ""; // keep relative for axios with CRA proxy
