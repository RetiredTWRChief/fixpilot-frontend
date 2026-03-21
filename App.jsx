import React from "react";

export default function App() {
  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoContainer}>
            <img src="/logo.png" alt="FixPilot logo" style={styles.logo} />
          </div>

          <div>
            <h1 style={styles.title}>FixPilot</h1>
            <p style={styles.subtitle}>
              Your AI mechanic vehicle repair assistant
            </p>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Diagnose your vehicle like a professional mechanic
        </h2>
        <p style={styles.heroText}>
          Describe your symptoms and FixPilot will guide you step-by-step,
          recommend tools, suggest parts, and help you decide your next move.
        </p>
      </div>

      {/* PLACEHOLDER */}
      <div style={styles.placeholder}>
        <h3>No diagnosis yet</h3>
        <p>Enter vehicle details to begin.</p>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f8fc",
    minHeight: "100vh",
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  logoContainer: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  title: {
    margin: 0,
    fontSize: "2rem",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#64748b",
  },

  hero: {
    background: "#1e293b",
    color: "white",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "20px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "1.6rem",
  },

  heroText: {
    marginTop: "10px",
    color: "#cbd5e1",
  },

  placeholder: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
  },
};
