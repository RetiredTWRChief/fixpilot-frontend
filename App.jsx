import React, { useState } from "react";

const API_BASE_URL = "https://fixpilot-beta.onrender.com";

export default function App() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function submitProblem() {
    setError("");
    setResult(null);

    if (!problem.trim()) {
      setError("Please describe the problem first.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ problem })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Could not connect to FixPilot backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial", padding: 40, maxWidth: 900 }}>
      <h1>FixPilot</h1>
      <p>AI repair copilot beta.</p>

      <div style={{ marginTop: 24 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 10 }}>
          Describe your repair problem
        </label>

        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Example: My truck won't start and I hear one click."
          style={{
            width: "100%",
            minHeight: 140,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            fontSize: 16
          }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={submitProblem}
          disabled={loading}
          style={{
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          {loading ? "Analyzing..." : "Get FixPilot Guidance"}
        </button>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b"
          }}
        >
          {error}
        </div>
      ) : null}

      {result ? (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 14,
            border: "1px solid #d1d5db",
            background: "#f8fafc"
          }}
        >
          <h2 style={{ marginTop: 0 }}>{result.title}</h2>

          <p>
            <strong>Likely issue:</strong> {result.likelyIssue}
          </p>

          <div style={{ marginTop: 16 }}>
            <strong>Recommended steps:</strong>
            <ul>
              {result.steps?.map((step, index) => (
                <li key={index} style={{ marginTop: 8 }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 16 }}>
            <strong>Tools:</strong>
            <ul>
              {result.tools?.map((tool, index) => (
                <li key={index} style={{ marginTop: 8 }}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ marginTop: 16 }}>
            <strong>Safety:</strong> {result.safety}
          </p>
        </div>
      ) : null}
    </div>
  );
}
