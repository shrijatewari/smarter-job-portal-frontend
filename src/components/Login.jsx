import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check for OAuth errors in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    if (error) {
      const errorMessages = {
        'google_oauth_failed': 'Google login failed. Please try again.',
        'github_oauth_failed': 'GitHub login failed. Please try again.',
        'token_generation_failed': 'Authentication failed. Please try again.',
      };
      setError(errorMessages[error] || 'Authentication failed. Please try again.');
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(""); // Clear previous errors
    
    try {
      console.log("Submitting login", { email });
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      }, {
        timeout: 10000
      });

      console.log("Login response:", res.data);

      // Flexible destructuring to handle different backend shapes
      const token = res.data.token || res.data.accessToken;
      const user = res.data.user || res.data.profile;

      if (token) {
        localStorage.setItem("token", token);
        if (onLogin) onLogin(token, user);
        navigate("/dashboard");
      } else {
        setError("Login failed: No token returned from server.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Sign in to your account</p>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-sm">
            <strong>Login Error:</strong> {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setError(""); // Clear any existing errors
              window.location.href = "http://localhost:4000/api/auth/google";
            }}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                s5.373-12,12-12c3.059,0,5.842,1.155,7.961,3.039l5.657-5.657C33.64,6.053,29.084,4,24,4C12.955,4,4,12.955,4,24
                s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.155,7.961,3.039l5.657-5.657
                C33.64,6.053,29.084,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.19-5.238C29.211,35.091,26.715,36,24,36
                c-5.202,0-9.619-3.317-11.283-7.946l-6.54,5.038C8.505,39.556,15.64,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.994,5.566
                c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.343,39.992,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => {
              setError(""); // Clear any existing errors
              window.location.href = "http://localhost:4000/api/auth/github";
            }}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor" className="text-gray-900 dark:text-white">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-400">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
