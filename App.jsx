import { useState } from "react";
import heroImage from "./assets/fixpilot-hero.png";

export default function App() {
  const [issue, setIssue] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    if (!issue.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("https://fixpilot-beta.onrender.com/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue }),
      });

      const data = await res.json();
      setResult(data.result || "No result returned.");
    } catch (err) {
      setResult("Error connecting to FixPilot AI.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>FixPilot AI</div>
      </div>

      {/* HERO SECTION */}
      <div style={styles.heroSection}>
        <img src={heroImage} alt="FixPilot AI" style={styles.heroImage} />
      </div>

      {/* INPUT SECTION */}
      <div style={styles.card}>
        <h2 style={styles.title}>What’s wrong with your vehicle?</h2>

        <textarea
          placeholder="Example: My car won’t start and I hear clicking noises..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={handleDiagnose} style={styles.button}>
          {loading ? "Diagnosing..." : "Get Diagnosis"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div style={styles.resultCard}>
          <h3>Diagnosis:</h3>
          <p style={styles.resultText}>{result}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    paddingBottom: "40px",
  },

  navbar: {
    padding: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
    background: "#020617",
    borderBottom: "1px solid #1e293b",
  },

  logo: {
    color: "#ef4444",
    letterSpacing: "1px",
  },

  heroSection: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },

  heroImage: {
    width: "90%",
    maxWidth: "900px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  card: {
    margin: "40px auto",
    width: "90%",
    maxWidth: "600px",
    background: "#020617",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },

  title: {
    marginBottom: "15px",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    resize: "none",
    marginBottom: "15px",
    background: "#1e293b",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultCard: {
    margin: "20px auto",
    width: "90%",
    maxWidth: "600px",
    background: "#020617",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #1e293b",
  },

  resultText: {
    marginTop: "10px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
};
