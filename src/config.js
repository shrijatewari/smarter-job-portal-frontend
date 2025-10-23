// src/config.js
export const BACKEND_URL = "https://smarter-job-portal-backend.onrender.com";
export const API_BASE = process.env.REACT_APP_API_BASE || ""; // keep relative for axios with CRA proxy

// Force backend URL for production
if (typeof window !== 'undefined') {
  console.log('Backend URL:', BACKEND_URL);
}
