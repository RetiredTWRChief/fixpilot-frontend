import React, { useState } from "react";

const API_BASE_URL = "https://fixpilot-beta.onrender.com";

export default function App() {
  const [status, setStatus] = useState("Not checked yet");
  const [loading, setLoading] = useState(false);

  async function checkBackend() {
    try {
      setLoading(true);
      setStatus("Checking backend...");

      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();

      if (data.ok) {
        setStatus(`Connected: ${data.message}`);
      } else {
        setStatus("Backend responded, but not as expected.");
      }
    } catch (error) {
      setStatus("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial", padding: 40, maxWidth: 800 }}>
      <h1>FixPilot</h1>
      <p>AI repair copilot beta.</p>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={checkBackend}
          disabled={loading}
          style={{
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {loading ? "Checking..." : "Test Backend Connection"}
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #d1d5db",
          borderRadius: 12,
          background: "#f9fafb"
        }}
      >
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
}
