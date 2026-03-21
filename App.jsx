import { useState } from "react";
import heroImage from "./assets/fixpilot-hero.png";
import logoImage from "./assets/fixpilot-logo.png";

export default function App() {
  const [issue, setIssue] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    if (!issue.trim()) {
      setResult("Please describe the issue first.");
      return;
    }

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
      setResult(data.result || "No diagnosis returned.");
    } catch (error) {
      setResult("Error connecting to FixPilot AI.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToDiagnose = () => {
    document.getElementById("diagnose")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.brandWrap}>
            <img src={logoImage} alt="logo" style={styles.logo} />
            <div>
              <div style={styles.brandTitle}>
                FIXPILOT <span style={styles.brandAccent}>AI</span>
              </div>
              <div style={styles.brandSubtitle}>
                Smart vehicle diagnosis
              </div>
            </div>
          </div>

          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>
              Features
            </a>
            <a href="#diagnose" style={styles.navLink}>
              Diagnose
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroTextBlock}>
            <h1 style={styles.heroTitle}>
              Diagnose vehicle problems like a pro.
            </h1>

            <p style={styles.heroText}>
              FixPilot AI gives clear, mechanic-style explanations so anyone can
              understand what’s wrong and what to do next.
            </p>

            <button style={styles.primaryButton} onClick={scrollToDiagnose}>
              Start Diagnosis
            </button>
          </div>

          <img src={heroImage} alt="hero" style={styles.heroImage} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionTitle}>Why FixPilot?</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>🔧 Clear Guidance</h3>
            <p>No confusing tech talk. Easy instructions.</p>
          </div>

          <div style={styles.card}>
            <h3>🚗 Real Problems</h3>
            <p>Handles real-world car symptoms.</p>
          </div>

          <div style={styles.card}>
            <h3>🛠️ Tool Suggestions</h3>
            <p>Know what you need before you start.</p>
          </div>
        </div>
      </section>

      {/* DIAGNOSIS */}
      <section id="diagnose" style={styles.section}>
        <h2 style={styles.sectionTitle}>Try FixPilot AI</h2>

        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Describe your car issue..."
          style={styles.textarea}
        />

        <button onClick={handleDiagnose} style={styles.primaryButton}>
          {loading ? "Diagnosing..." : "Get Diagnosis"}
        </button>

        {result && (
          <div style={styles.resultBox}>
            <p>{result}</p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        FIXPILOT AI © 2026
      </footer>
    </div>
  );
}

const styles = {
  page: {
    background: "#0b0f19",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  navbar: {
    background: "#020617",
    padding: "15px 20px",
    borderBottom: "1px solid #1e293b",
  },

  navInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    width: "40px",
  },

  brandTitle: {
    fontWeight: "bold",
  },

  brandAccent: {
    color: "#ef4444",
  },

  brandSubtitle: {
    fontSize: "12px",
    color: "#aaa",
  },

  navLinks: {
    display: "flex",
    gap: "15px",
  },

  navLink: {
    color: "#ccc",
    textDecoration: "none",
  },

  hero: {
    padding: "40px 20px",
  },

  heroContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1100px",
    margin: "0 auto",
    gap: "20px",
  },

  heroTextBlock: {
    maxWidth: "500px",
  },

  heroTitle: {
    fontSize: "36px",
  },

  heroText: {
    margin: "15px 0",
    color: "#bbb",
  },

  heroImage: {
    width: "400px",
    borderRadius: "12px",
  },

  primaryButton: {
    background: "#ef4444",
    border: "none",
    padding: "12px 20px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  section: {
    padding: "40px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  grid: {
    display: "flex",
    gap: "20px",
  },

  card: {
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },

  textarea: {
    width: "100%",
    height: "120px",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
  },

  resultBox: {
    marginTop: "20px",
    background: "#020617",
    padding: "15px",
    borderRadius: "8px",
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #1e293b",
    marginTop: "40px",
  },
};
