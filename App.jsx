import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    engine: "",
    vin: "",
    symptoms: "",
  });

  const [extraDetails, setExtraDetails] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const runDiagnosis = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to get diagnosis.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setExtraDetails("");
    setSelectedQuestion("");
    await runDiagnosis(formData);
  };

  const handleAddDetailsSubmit = async (e) => {
    e.preventDefault();

    const combinedSymptoms = [
      formData.symptoms?.trim(),
      selectedQuestion
        ? `${selectedQuestion} ${extraDetails}`.trim()
        : extraDetails.trim(),
    ]
      .filter(Boolean)
      .join("\n\nAdditional details:\n");

    const updatedPayload = {
      ...formData,
      symptoms: combinedSymptoms,
    };

    setFormData((prev) => ({
      ...prev,
      symptoms: combinedSymptoms,
    }));

    await runDiagnosis(updatedPayload);

    setExtraDetails("");
    setSelectedQuestion("");
  };

  const difficultyClass = (difficulty) => {
    const text = (difficulty || "").toLowerCase();
    if (text.includes("beginner")) return "badge beginner";
    if (text.includes("intermediate")) return "badge intermediate";
    return "badge advanced";
  };

  const needsMoreInfo =
    result?.title?.toLowerCase().includes("more information needed") ||
    result?.confidence?.toLowerCase().includes("low");

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        :root {
          --bg: #f3f7fc;
          --panel: #ffffff;
          --panel-soft: #f8fbff;
          --text: #152033;
          --muted: #60708a;
          --line: #d9e4f2;
          --blue: #2563eb;
          --blue-dark: #1d4ed8;
          --blue-soft: #eaf2ff;
          --green-soft: #dcfce7;
          --green-text: #166534;
          --amber-soft: #fef3c7;
          --amber-text: #92400e;
          --red-soft: #fee2e2;
          --red-text: #991b1b;
          --shadow: 0 18px 42px rgba(17, 24, 39, 0.08);
          --radius-xl: 24px;
          --radius-lg: 18px;
          --radius-md: 14px;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 28%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 24%),
            var(--bg);
          color: var(--text);
        }

        a {
          color: var(--blue-dark);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .app-shell {
          min-height: 100vh;
          padding: 28px 16px 56px;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-mark {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #2563eb, #0f172a);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
          color: white;
          font-size: 1.3rem;
          font-weight: 800;
        }

        .brand-copy h1 {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.1;
        }

        .brand-copy p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .hero {
          background: linear-gradient(135deg, #0f172a, #1f2937 55%, #1d4ed8 130%);
          color: white;
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: 0 22px 52px rgba(15, 23, 42, 0.18);
          margin-bottom: 24px;
          overflow: hidden;
          position: relative;
        }

        .hero::after {
          content: "";
          position: absolute;
          right: -40px;
          top: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 62%);
          pointer-events: none;
        }

        .hero h2 {
          margin: 0 0 10px;
          font-size: 2rem;
          line-height: 1.15;
          max-width: 780px;
        }

        .hero p {
          margin: 0;
          color: #d7e3f4;
          line-height: 1.7;
          max-width: 860px;
          font-size: 1rem;
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .hero-tag {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.14);
          color: white;
          font-size: 0.86rem;
          font-weight: 700;
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 980px) {
          .layout {
            grid-template-columns: 400px 1fr;
            align-items: start;
          }
        }

        .panel,
        .info-card,
        .conversation-box,
        .placeholder {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow);
        }

        .panel {
          padding: 22px;
          position: sticky;
          top: 18px;
        }

        .panel h3,
        .info-card h3,
        .conversation-box h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.08rem;
        }

        .panel-title {
          margin: 0 0 8px;
          font-size: 1.28rem;
        }

        .subtext {
          margin: 0 0 18px;
          color: var(--muted);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          margin-bottom: 7px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #23314b;
        }

        .field input,
        .field textarea {
          width: 100%;
          border: 1px solid #cfdced;
          background: white;
          border-radius: 14px;
          padding: 13px 14px;
          font-size: 0.97rem;
          color: var(--text);
          outline: none;
          transition: 0.18s ease;
        }

        .field input:focus,
        .field textarea:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .field textarea {
          min-height: 150px;
          resize: vertical;
          line-height: 1.5;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .submit-btn,
        .secondary-btn,
        .chip-link {
          cursor: pointer;
          transition: 0.16s ease;
        }

        .submit-btn {
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 14px 18px;
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          color: white;
          font-size: 1rem;
          font-weight: 800;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
        }

        .submit-btn:hover {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
        }

        .secondary-btn {
          width: 100%;
          border: 1px solid #bfdbfe;
          background: var(--blue-soft);
          color: var(--blue-dark);
          border-radius: 16px;
          padding: 14px 18px;
          font-size: 0.96rem;
          font-weight: 800;
          margin-top: 10px;
        }

        .error-box {
          margin-top: 14px;
          background: #fff1f2;
          color: #9f1239;
          border: 1px solid #fecdd3;
          border-radius: 14px;
          padding: 14px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .placeholder {
          padding: 34px;
          text-align: center;
          color: var(--muted);
        }

        .placeholder h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: var(--text);
          font-size: 1.3rem;
        }

        .result-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .top-summary {
          background: linear-gradient(135deg, #eff6ff, #f8fbff);
          border: 1px solid #dbeafe;
          border-radius: var(--radius-xl);
          padding: 22px;
          box-shadow: var(--shadow);
        }

        .mechanic-intro {
          font-size: 1.02rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .top-summary h2 {
          margin: 0 0 10px;
          font-size: 1.5rem;
          line-height: 1.2;
        }

        .top-summary p {
          margin: 0 0 12px;
          color: #334155;
          line-height: 1.7;
        }

        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.84rem;
          font-weight: 800;
        }

        .confidence {
          background: #e0f2fe;
          color: #075985;
        }

        .beginner {
          background: var(--green-soft);
          color: var(--green-text);
        }

        .intermediate {
          background: var(--amber-soft);
          color: var(--amber-text);
        }

        .advanced {
          background: var(--red-soft);
          color: var(--red-text);
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 900px) {
          .section-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .info-card,
        .conversation-box {
          padding: 20px;
        }

        .info-card p,
        .conversation-box p {
          margin: 0;
          line-height: 1.7;
          color: #334155;
        }

        .warning-card {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .stop-card {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .list {
          margin: 0;
          padding-left: 20px;
          color: #334155;
        }

        .list li {
          margin-bottom: 10px;
          line-height: 1.65;
        }

        .tool-list,
        .resource-grid {
          display: grid;
          gap: 12px;
        }

        @media (min-width: 900px) {
          .resource-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .tool-item,
        .resource-item {
          background: #f8fbff;
          border: 1px solid #dde8f5;
          border-radius: 16px;
          padding: 14px;
        }

        .tool-item strong,
        .resource-item strong {
          display: block;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .tool-item span {
          color: #475569;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .chip-link {
          border: none;
          padding: 8px 12px;
          border-radius: 999px;
          background: #e0ecff;
          color: var(--blue-dark);
          font-size: 0.86rem;
          font-weight: 800;
          display: inline-block;
        }

        .chip-link:hover {
          transform: translateY(-1px);
          text-decoration: none;
        }

        .question-box {
          background: #f8fbff;
        }

        .question-item {
          margin-bottom: 14px;
        }

        .question-item:last-child {
          margin-bottom: 0;
        }

        .question-text {
          margin-top: 8px;
          color: #334155;
          line-height: 1.6;
        }

        .conversation-box {
          background: linear-gradient(180deg, #f8fbff, #ffffff);
          border-color: #93c5fd;
        }

        .conversation-box h3 {
          color: #1d4ed8;
          margin-bottom: 10px;
        }

        .conversation-box textarea {
          min-height: 120px;
        }

        .selected-question {
          margin-bottom: 10px;
          padding: 10px 12px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          color: #1e3a8a;
          font-weight: 700;
          line-height: 1.5;
        }

        .mechanic-closing {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 15px;
          color: #1e3a8a;
          font-weight: 700;
          line-height: 1.7;
        }

        .footer-note {
          margin-top: 20px;
          text-align: center;
          color: var(--muted);
          font-size: 0.9rem;
        }
      `}</style>

      <div className="container">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">FP</div>
            <div className="brand-copy">
              <h1>FixPilot</h1>
              <p>Mechanic-style vehicle diagnosis assistant</p>
            </div>
          </div>
        </div>

        <div className="hero">
          <h2>Get clearer vehicle guidance before you buy parts or call a shop.</h2>
          <p>
            FixPilot helps you describe the problem, narrow down likely causes,
            ask the right follow-up questions, and move toward a smarter next step.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">Guided diagnosis</span>
            <span className="hero-tag">Parts lookup</span>
            <span className="hero-tag">Video help</span>
            <span className="hero-tag">Nearby stores</span>
          </div>
        </div>

        <div className="layout">
          <div className="panel">
            <h3 className="panel-title">Enter Vehicle Details</h3>
            <p className="subtext">
              The more specific you are, the better the diagnosis will be.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="year">Year</label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2019"
                  />
                </div>

                <div className="field">
                  <label htmlFor="make">Make</label>
                  <input
                    id="make"
                    name="make"
                    type="text"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Ram"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label htmlFor="model">Model</label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="1500 Limited"
                  />
                </div>

                <div className="field">
                  <label htmlFor="engine">Engine</label>
                  <input
                    id="engine"
                    name="engine"
                    type="text"
                    value={formData.engine}
                    onChange={handleChange}
                    placeholder="5.7L V8"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="vin">VIN</label>
                <input
                  id="vin"
                  name="vin"
                  type="text"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="Enter VIN if available"
                />
              </div>

              <div className="field">
                <label htmlFor="symptoms">Describe the Symptoms</label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Example: The truck struggles to start in the morning, I hear clicking, and the battery light came on yesterday."
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Analyzing Vehicle Symptoms..." : "Get Diagnosis"}
              </button>
            </form>

            {error && <div className="error-box">{error}</div>}
          </div>

          <div>
            {!result ? (
              <div className="placeholder">
                <h3>No diagnosis yet</h3>
                <p>
                  Enter the vehicle details and symptoms, then click{" "}
                  <strong>Get Diagnosis</strong> to start the conversation.
                </p>
              </div>
            ) : (
              <div className="result-card">
                <div className="top-summary">
                  {result.mechanicIntro && (
                    <div className="mechanic-intro">{result.mechanicIntro}</div>
                  )}

                  <h2>{result.title}</h2>
                  <p>{result.summary}</p>

                  <div className="badge-row">
                    <span className="badge confidence">
                      Confidence: {result.confidence}
                    </span>
                    <span className={difficultyClass(result.difficulty)}>
                      Difficulty: {result.difficulty}
                    </span>
                  </div>
                </div>

                {needsMoreInfo ? (
                  <>
                    {result.followUpQuestions?.length > 0 && (
                      <div className="info-card question-box">
                        <h3>Questions I’d Ask Next Like A Mechanic Would</h3>
                        <div>
                          {result.followUpQuestions.map((question, index) => (
                            <div className="question-item" key={index}>
                              <button
                                type="button"
                                className="chip-link"
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setExtraDetails("It happens when ");
                                }}
                              >
                                Use this question
                              </button>
                              <div className="question-text">{question}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="conversation-box">
                      <h3>Tell Me A Little More So I Can Narrow It Down</h3>
                      <p className="subtext">
                        I do not have enough detail yet to give you a real diagnosis.
                        Add more information below and I’ll take another look.
                      </p>

                      {selectedQuestion && (
                        <div className="selected-question">
                          Selected question: {selectedQuestion}
                        </div>
                      )}

                      <form onSubmit={handleAddDetailsSubmit}>
                        <div className="field">
                          <label htmlFor="extraDetails">Add more information here</label>
                          <textarea
                            id="extraDetails"
                            value={extraDetails}
                            onChange={(e) => setExtraDetails(e.target.value)}
                            placeholder="Example: It only happens when I first press the gas pedal, especially in the morning. No check engine light. After a few minutes it runs normal."
                            required
                          />
                        </div>

                        <button
                          className="submit-btn"
                          type="submit"
                          disabled={loading}
                        >
                          {loading
                            ? "Updating Diagnosis..."
                            : "Update Diagnosis With More Detail"}
                        </button>

                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => {
                            setExtraDetails("");
                            setSelectedQuestion("");
                          }}
                        >
                          Clear Added Detail
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section-grid">
                      <div className="info-card">
                        <h3>Why This Might Be Happening</h3>
                        <p>{result.why}</p>
                      </div>

                      <div className="info-card">
                        <h3>What To Check First</h3>
                        <p>{result.firstCheck}</p>
                      </div>

                      <div className="info-card warning-card">
                        <h3>Safety Warning</h3>
                        <p>{result.safety}</p>
                      </div>

                      <div className="info-card stop-card">
                        <h3>When To Stop And Call A Mechanic</h3>
                        <p>{result.whenToStop}</p>
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>Tools You May Need</h3>
                      <div className="tool-list">
                        {result.tools?.map((tool, index) => (
                          <div className="tool-item" key={index}>
                            <strong>{tool.name}</strong>
                            <span>{tool.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>Step-By-Step Beginner-Friendly Checks</h3>
                      <ol className="list">
                        {result.steps?.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="info-card">
                      <h3>Parts Lookup Links</h3>
                      <div className="resource-grid">
                        {result.partLinks?.map((part, index) => (
                          <div className="resource-item" key={index}>
                            <strong>{part.name}</strong>
                            <div className="link-row">
                              <a
                                className="chip-link"
                                href={part.google}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Google
                              </a>
                              <a
                                className="chip-link"
                                href={part.amazon}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Amazon
                              </a>
                              <a
                                className="chip-link"
                                href={part.autozone}
                                target="_blank"
                                rel="noreferrer"
                              >
                                AutoZone
                              </a>
                              <a
                                className="chip-link"
                                href={part.rockauto}
                                target="_blank"
                                rel="noreferrer"
                              >
                                RockAuto
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>Nearby Parts Stores</h3>
                      <div className="resource-grid">
                        <div className="resource-item">
                          <strong>Find nearby stores</strong>
                          <div className="link-row">
                            <a
                              className="chip-link"
                              href="https://www.google.com/maps/search/AutoZone+near+me"
                              target="_blank"
                              rel="noreferrer"
                            >
                              AutoZone
                            </a>
                            <a
                              className="chip-link"
                              href="https://www.google.com/maps/search/O'Reilly+Auto+Parts+near+me"
                              target="_blank"
                              rel="noreferrer"
                            >
                              O'Reilly
                            </a>
                            <a
                              className="chip-link"
                              href="https://www.google.com/maps/search/Advance+Auto+Parts+near+me"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Advance Auto
                            </a>
                            <a
                              className="chip-link"
                              href="https://www.google.com/maps/search/NAPA+Auto+Parts+near+me"
                              target="_blank"
                              rel="noreferrer"
                            >
                              NAPA
                            </a>
                            <a
                              className="chip-link"
                              href="https://www.google.com/maps/search/Walmart+Auto+Parts+near+me"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Walmart
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>Helpful Videos</h3>
                      <div className="resource-grid">
                        {result.videoLinks?.map((video, index) => (
                          <div className="resource-item" key={index}>
                            <strong>{video.title}</strong>
                            <div className="link-row">
                              <a
                                className="chip-link"
                                href={video.youtube}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Watch on YouTube
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.extraNotes?.length > 0 && (
                      <div className="info-card">
                        <h3>Extra Notes</h3>
                        <ul className="list">
                          {result.extraNotes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.mechanicClosing && (
                      <div className="mechanic-closing">
                        {result.mechanicClosing}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="footer-note">
          This tool gives guided repair advice, not a guaranteed repair answer.
          Always inspect safely before buying parts or replacing components.
        </div>
      </div>
    </div>
  );
}
