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
        body {
          margin: 0;
          font-family: Arial;
          background: #f4f7fb;
        }
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
        }
        .panel, .info-card {
          background: white;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
        }
        .submit-btn, .secondary-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          margin-top: 10px;
          cursor: pointer;
        }
        .submit-btn {
          background: #2563eb;
          color: white;
          border: none;
        }
        .secondary-btn {
          background: #e0ecff;
          border: none;
        }
        .chip-link {
          padding: 6px 10px;
          background: #e0ecff;
          border-radius: 999px;
          margin: 4px;
          display: inline-block;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
        }
      `}</style>

      <div className="container">
        <h1>FixPilot</h1>

        <div className="panel">
          <form onSubmit={handleSubmit}>
            <input name="year" placeholder="Year" onChange={handleChange} />
            <input name="make" placeholder="Make" onChange={handleChange} />
            <input name="model" placeholder="Model" onChange={handleChange} />
            <input name="engine" placeholder="Engine" onChange={handleChange} />
            <input name="vin" placeholder="VIN" onChange={handleChange} />
            <textarea
              name="symptoms"
              placeholder="Describe the issue..."
              onChange={handleChange}
              required
            />
            <button className="submit-btn">
              {loading ? "Analyzing..." : "Get Diagnosis"}
            </button>
          </form>
          {error && <div>{error}</div>}
        </div>

        {!result ? null : (
          <div>
            <div className="info-card">
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
            </div>

            {needsMoreInfo ? (
              <>
                <div className="info-card">
                  <h3>Questions:</h3>
                  {result.followUpQuestions?.map((q, i) => (
                    <div key={i}>
                      <button
                        className="chip-link"
                        onClick={() => {
                          setSelectedQuestion(q);
                          setExtraDetails("It happens when ");
                        }}
                      >
                        Use
                      </button>
                      {q}
                    </div>
                  ))}
                </div>

                <div className="info-card">
                  <form onSubmit={handleAddDetailsSubmit}>
                    <textarea
                      value={extraDetails}
                      onChange={(e) => setExtraDetails(e.target.value)}
                      required
                    />
                    <button className="submit-btn">
                      Update Diagnosis
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="info-card">
                  <h3>Steps</h3>
                  <ul>
                    {result.steps?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-card">
                  <h3>Parts</h3>
                  {result.partLinks?.map((p, i) => (
                    <div key={i}>
                      <strong>{p.name}</strong>
                      <div>
                        <a href={p.google} target="_blank">Google</a>{" "}
                        <a href={p.amazon} target="_blank">Amazon</a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="info-card">
                  <h3>Nearby Stores</h3>
                  <a href="https://www.google.com/maps/search/AutoZone+near+me" target="_blank">AutoZone</a><br/>
                  <a href="https://www.google.com/maps/search/O'Reilly+Auto+Parts+near+me" target="_blank">O'Reilly</a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
