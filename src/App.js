import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./utils/api";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileEditor from "./components/ProfileEditor";
import Internships from "./pages/Internships";
import OAuthCallback from "./components/OAuthCallback";

// Components
import Navbar from "./components/Navbar";

// Theme Context
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

// Toast notifications
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const [user, setUser] = useState(null);

  // Runs once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/api/auth/profile")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          delete api.defaults.headers.common["Authorization"];
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const handleLogin = (token, userFromServer) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (userFromServer) {
      setUser(userFromServer);
    } else {
      api
        .get("/api/auth/profile")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <div
          className={`min-h-screen transition-colors duration-500 ${
            theme === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-gray-50 text-gray-900"
          }`}
        >
          <Router>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

            <div className="container mx-auto mt-6 px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/internships" element={<Internships />} />
                <Route
                  path="/login"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Login onLogin={handleLogin} />
                    )
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Signup onSignup={handleLogin} />
                    )
                  }
                />
                <Route
                  path="/oauth/callback"
                  element={<OAuthCallback onAuth={handleLogin} />}
                />
                <Route
                  path="/profile"
                  element={isLoggedIn ? <ProfileEditor /> : <Navigate to="/login" />}
                />
                <Route
                  path="/dashboard"
                  element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/analytics"
                  element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
                />
              </Routes>
            </div>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </Router>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
