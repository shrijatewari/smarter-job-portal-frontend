import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function OAuthCallback({ onAuth }) {
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const token = query.get("token");
    const error = query.get("error");

    if (error) {
      alert("Social login failed: " + error);
      navigate("/login");
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Fetch profile to hydrate app state
        api
          .get("/api/auth/profile")
          .then((res) => {
            console.log("✅ OAuth profile fetched successfully");
            if (onAuth) onAuth(token, res.data);
            navigate("/dashboard");
          })
          .catch((err) => {
            console.error("❌ OAuth profile fetch failed:", err);
            // If profile fetch fails, still store token and go to dashboard
            if (onAuth) onAuth(token, null);
            navigate("/dashboard");
          });
      } catch (e) {
        console.error("❌ OAuth callback error", e);
        alert("Could not complete login. Please try again.");
        navigate("/login");
      }
    } else {
      console.error("❌ Missing token in OAuth callback");
      alert("Missing token in OAuth callback.");
      navigate("/login");
    }
  }, [navigate, onAuth, query]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-gray-600 dark:text-gray-300">
        Completing sign-in...
      </div>
    </div>
  );
}

export default OAuthCallback;
