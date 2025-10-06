// src/components/ThemeToggle.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300"
      style={{
        background: theme === "dark" ? "var(--card)" : "var(--card)",
        boxShadow: "var(--shadow)",
        border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute left-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: theme === "light" ? 1 : 0 }}
        style={{ color: "#F59E0B" }}
      >
        <FaSun />
      </motion.div>
      <motion.div
        className="absolute right-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: theme === "dark" ? 1 : 0 }}
        style={{ color: "#3B82F6" }}
      >
        <FaMoon />
      </motion.div>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className={`w-6 h-6 rounded-full transform`}
        style={{
          background: theme === "dark" ? "#111827" : "#ffffff",
          boxShadow: "var(--shadow)",
          translate: theme === "dark" ? "28px 0" : "0 0",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
