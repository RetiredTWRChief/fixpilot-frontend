import React, { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    engine: "",
    vin: "",
    zip: "",
    symptoms: "",
  });

  const [extraDetails, setExtraDetails] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [shops, setShops] = useState([]);
  const [shopsCategory, setShopsCategory] = useState("");
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState("");

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
    setShops([]);
    setShopsError("");
    setShopsCategory("");
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

  useEffect(() => {
    const fetchShops = async () => {
      if (!result || needsMoreInfo || !formData.zip.trim()) {
        setShops([]);
        setShopsCategory("");
        setShopsError("");
        return;
      }

      setShopsLoading(true);
      setShopsError("");

      try {
        const response = await fetch(`${API_URL}/shops`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zip: formData.zip.trim(),
            title: result.title,
            summary: result.summary,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to find repair shops.");
        }

        setShops(data.shops || []);
        setShopsCategory(data.categoryLabel || "");
      } catch (err) {
        setShops([]);
        setShopsCategory("");
        setShopsError(err.message || "Unable to find repair shops.");
      } finally {
        setShopsLoading(false);
      }
    };

    fetchShops();
  }, [result, needsMoreInfo, formData.zip]);

  const shopHint = useMemo(() => {
    if (!formData.zip.trim()) return "Enter a ZIP code to see ranked repair shops.";
    if (shopsLoading) return "Finding the best-rated repair shops near your ZIP code...";
    if (shopsError) return shopsError;
    if (shops.length === 0) return "No ranked repair shops found yet for this ZIP code.";
    return "";
  }, [formData.zip, shopsLoading, shopsError, shops]);

  const logoSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#g)"/>
      <path d="M20 36c0-7 5-12 12-12 3 0 5.8.9 8 2.6l4-4 3.4 3.4-4 4A15.6 15.6 0 0 1 44 36h-5c0-4-3-7-7-7s-7 3-7 7h-5zm3 4h18v5H23z" fill="white"/>
    </svg>
  `);

  const renderToolImage = (toolName) => {
    const name = (toolName || "").toLowerCase();

    if (
      name.includes("socket") ||
      name.includes("ratchet") ||
      name.includes("extension")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <rect x="14" y="34" width="32" height="12" rx="6" fill="#1d4ed8" />
          <rect x="44" y="37" width="18" height="6" rx="3" fill="#93c5fd" />
          <circle cx="20" cy="40" r="6" fill="#dbeafe" />
          <rect x="59" y="34" width="7" height="12" rx="2" fill="#cbd5e1" />
        </svg>
      );
    }

    if (name.includes("multimeter") || name.includes("scanner")) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <rect x="24" y="14" width="32" height="52" rx="8" fill="#0f172a" />
          <rect x="29" y="20" width="22" height="12" rx="3" fill="#93c5fd" />
          <circle cx="40" cy="46" r="8" fill="#2563eb" />
          <rect x="32" y="58" width="16" height="4" rx="2" fill="#cbd5e1" />
        </svg>
      );
    }

    if (
      name.includes("flashlight") ||
      name.includes("light")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <rect x="22" y="30" width="28" height="18" rx="6" fill="#1e293b" />
          <rect x="50" y="34" width="8" height="10" rx="2" fill="#64748b" />
          <path d="M58 39l10-6v12z" fill="#fde68a" />
        </svg>
      );
    }

    if (
      name.includes("brush") ||
      name.includes("cleaning")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <rect x="18" y="36" width="30" height="8" rx="4" fill="#92400e" />
          <rect x="48" y="32" width="10" height="16" rx="2" fill="#2563eb" />
          <path d="M58 33v14M62 33v14M66 33v14" stroke="#60a5fa" strokeWidth="3" />
        </svg>
      );
    }

    if (
      name.includes("glove") ||
      name.includes("gloves")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <path
            d="M30 60c-6 0-10-4-10-10V28c0-2 1-4 3-4s3 2 3 4v8h2V20c0-2 1-4 3-4s3 2 3 4v16h2V18c0-2 1-4 3-4s3 2 3 4v18h2V22c0-2 1-4 3-4s3 2 3 4v27c0 6-5 11-11 11H30z"
            fill="#2563eb"
          />
        </svg>
      );
    }

    if (
      name.includes("pliers") ||
      name.includes("clamp")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <path d="M28 28l12 12-6 6-12-12z" fill="#1d4ed8" />
          <path d="M52 28L40 40l6 6 12-12z" fill="#1d4ed8" />
          <circle cx="40" cy="40" r="5" fill="#93c5fd" />
          <path d="M34 46l-8 16M46 46l8 16" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }

    if (
      name.includes("jack") ||
      name.includes("stands")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <path d="M20 56h40l-8-14H28z" fill="#1d4ed8" />
          <path d="M40 24l10 18H30z" fill="#93c5fd" />
          <rect x="18" y="56" width="44" height="6" rx="3" fill="#0f172a" />
        </svg>
      );
    }

    if (
      name.includes("brake cleaner") ||
      name.includes("cleaner")
    ) {
      return (
        <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
          <rect x="28" y="18" width="24" height="44" rx="6" fill="#2563eb" />
          <rect x="33" y="14" width="14" height="8" rx="2" fill="#cbd5e1" />
          <rect x="33" y="28" width="14" height="14" rx="3" fill="#dbeafe" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 80 80" className="tool-svg" aria-hidden="true">
        <circle cx="40" cy="40" r="26" fill="#dbeafe" />
        <path
          d="M48 20l4 4-8 10 4 4 10-8 4 4-9 13-4 1-14-14 1-4 12-10zM26 52l6 6-8 4 2-10z"
          fill="#2563eb"
        />
      </svg>
    );
  };

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        :root {
          --bg: #f4f8fc;
          --panel: #ffffff;
          --panel-soft: #f8fbff;
          --text: #152033;
          --muted: #64748b;
          --line: #dbe5f1;
          --blue: #2563eb;
          --blue-dark: #1d4ed8;
          --blue-soft: #eaf2ff;
          --green-soft: #dcfce7;
          --green-text: #166534;
          --amber-soft: #fef3c7;
          --amber-text: #92400e;
          --red-soft: #fee2e2;
          --red-text: #991b1b;
          --shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
          --shadow-soft: 0 10px 24px rgba(15, 23, 42, 0.05);
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
          text-decoration: none;
        }

        .app-shell {
          min-height: 100vh;
          padding: 28px 16px 56px;
        }

        .container {
          max-width: 1260px;
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
          width: 56px;
          height: 56px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
          background: white;
          flex-shrink: 0;
        }

        .brand-mark img {
          width: 100%;
          height: 100%;
          display: block;
        }

        .brand-copy h1 {
          margin: 0;
          font-size: 1.55rem;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        .brand-copy p {
          margin: 5px 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .topbar-badge {
          padding: 10px 14px;
          border-radius: 999px;
          background: white;
          border: 1px solid var(--line);
          color: var(--blue-dark);
          font-size: 0.88rem;
          font-weight: 800;
          box-shadow: var(--shadow-soft);
          white-space: nowrap;
        }

        .hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a, #1f2937 55%, #1d4ed8 130%);
          color: white;
          border-radius: var(--radius-xl);
          padding: 30px;
          box-shadow: 0 24px 56px rgba(15, 23, 42, 0.18);
          margin-bottom: 24px;
        }

        .hero::after {
          content: "";
          position: absolute;
          right: -60px;
          top: -60px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.16), transparent 62%);
          pointer-events: none;
        }

        .hero h2 {
          margin: 0 0 10px;
          font-size: 2rem;
          line-height: 1.1;
          max-width: 820px;
          letter-spacing: -0.03em;
        }

        .hero p {
          margin: 0;
          color: #d8e4f5;
          line-height: 1.7;
          max-width: 880px;
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
          border: 1px solid rgba(255,255,255,0.16);
          color: white;
          font-size: 0.86rem;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1020px) {
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
          letter-spacing: -0.01em;
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
        .chip-link,
        .tool-search-btn,
        .shop-action {
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

        .submit-btn:hover,
        .secondary-btn:hover,
        .tool-search-btn:hover,
        .shop-action:hover {
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
          font-size: 1.58rem;
          line-height: 1.18;
          letter-spacing: -0.02em;
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
        .resource-grid,
        .shop-grid {
          display: grid;
          gap: 12px;
        }

        @media (min-width: 900px) {
          .resource-grid,
          .shop-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .tool-item,
        .resource-item,
        .shop-card {
          background: var(--panel-soft);
          border: 1px solid #dde8f5;
          border-radius: 18px;
          padding: 14px;
          box-shadow: var(--shadow-soft);
        }

        .tool-item {
          display: grid;
          grid-template-columns: 92px 1fr 120px;
          gap: 14px;
          align-items: center;
        }

        .tool-image {
          width: 92px;
          height: 92px;
          border-radius: 16px;
          border: 1px solid #dbeafe;
          background: linear-gradient(180deg, #ffffff, #eff6ff);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .tool-svg {
          width: 72px;
          height: 72px;
          display: block;
        }

        .tool-main strong,
        .resource-item strong,
        .shop-card strong {
          display: block;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .tool-spec,
        .shop-badge {
          display: inline-block;
          margin-bottom: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #e0ecff;
          color: #1d4ed8;
          font-size: 0.83rem;
          font-weight: 800;
        }

        .tool-main p {
          margin: 0 0 8px;
          color: #475569;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .tool-note,
        .shop-meta {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .tool-actions {
          min-width: 110px;
        }

        .tool-search-btn {
          display: inline-block;
          width: 100%;
          text-align: center;
          border: none;
          padding: 10px 12px;
          border-radius: 12px;
          background: #e0ecff;
          color: #1d4ed8;
          font-size: 0.88rem;
          font-weight: 800;
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

        .shop-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shop-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .shop-rank {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.88rem;
          flex-shrink: 0;
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.22);
        }

        .shop-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }

        .shop-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 800;
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #1d4ed8;
          min-width: 112px;
        }

        .shop-action.primary {
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          color: white;
          border: none;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .section-header-row h3 {
          margin-bottom: 0;
        }

        .section-pill {
          padding: 7px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.82rem;
          font-weight: 800;
          border: 1px solid #dbeafe;
          white-space: nowrap;
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

        @media (max-width: 760px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .topbar-badge {
            white-space: normal;
          }

          .tool-item {
            grid-template-columns: 1fr;
          }

          .tool-actions {
            min-width: 0;
          }

          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="container">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">
              <img
                src={`data:image/svg+xml;charset=utf-8,${logoSvg}`}
                alt="FixPilot logo"
              />
            </div>
            <div className="brand-copy">
              <h1>FixPilot</h1>
              <p>Mechanic-style vehicle diagnosis assistant</p>
            </div>
          </div>

          <div className="topbar-badge">Built to help you diagnose smarter before you spend money</div>
        </div>

        <div className="hero">
          <h2>Get clearer vehicle guidance before you buy parts or call a shop.</h2>
          <p>
            FixPilot helps you describe the problem, narrow down likely causes,
            ask the right follow-up questions, and move toward a smarter next step.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">Guided diagnosis</span>
            <span className="hero-tag">Detailed tools</span>
            <span className="hero-tag">Ranked repair shops</span>
            <span className="hero-tag">Parts lookup</span>
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
                  <input id="year" name="year" type="text" value={formData.year} onChange={handleChange} placeholder="2019" />
                </div>

                <div className="field">
                  <label htmlFor="make">Make</label>
                  <input id="make" name="make" type="text" value={formData.make} onChange={handleChange} placeholder="Ram" />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label htmlFor="model">Model</label>
                  <input id="model" name="model" type="text" value={formData.model} onChange={handleChange} placeholder="1500 Limited" />
                </div>

                <div className="field">
                  <label htmlFor="engine">Engine</label>
                  <input id="engine" name="engine" type="text" value={formData.engine} onChange={handleChange} placeholder="5.7L V8" />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label htmlFor="vin">VIN</label>
                  <input id="vin" name="vin" type="text" value={formData.vin} onChange={handleChange} placeholder="Enter VIN if available" />
                </div>

                <div className="field">
                  <label htmlFor="zip">ZIP Code</label>
                  <input id="zip" name="zip" type="text" value={formData.zip} onChange={handleChange} placeholder="32444" />
                </div>
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
                  Enter the vehicle details and symptoms, then click <strong>Get Diagnosis</strong> to start the conversation.
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
                    <span className="badge confidence">Confidence: {result.confidence}</span>
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

                        <button className="submit-btn" type="submit" disabled={loading}>
                          {loading ? "Updating Diagnosis..." : "Update Diagnosis With More Detail"}
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
                      <div className="section-header-row">
                        <h3>Tools You May Need</h3>
                        <div className="section-pill">Visual tool cards</div>
                      </div>

                      <div className="tool-list">
                        {result.tools?.map((tool, index) => (
                          <div className="tool-item" key={index}>
                            <div className="tool-image">
                              {renderToolImage(tool.name)}
                            </div>

                            <div className="tool-main">
                              <strong>{tool.name}</strong>
                              {tool.spec && <div className="tool-spec">{tool.spec}</div>}
                              <p>{tool.use}</p>
                              {tool.note && <div className="tool-note">{tool.note}</div>}
                            </div>

                            <div className="tool-actions">
                              <a
                                className="tool-search-btn"
                                href={tool.searchLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Tool
                              </a>
                            </div>
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
                              <a className="chip-link" href={part.google} target="_blank" rel="noreferrer">Google</a>
                              <a className="chip-link" href={part.amazon} target="_blank" rel="noreferrer">Amazon</a>
                              <a className="chip-link" href={part.autozone} target="_blank" rel="noreferrer">AutoZone</a>
                              <a className="chip-link" href={part.rockauto} target="_blank" rel="noreferrer">RockAuto</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="section-header-row">
                        <h3>Ranked Repair Shops For This Problem</h3>
                        {shopsCategory && (
                          <div className="section-pill">{shopsCategory}</div>
                        )}
                      </div>

                      <p className="subtext" style={{ marginBottom: 12 }}>
                        {shopsCategory
                          ? `Showing the highest-rated matches for ${shopsCategory.toLowerCase()} within about 100 miles of ${formData.zip.trim()}.`
                          : "Repair shop results will appear here after the search finishes."}
                      </p>

                      {shopHint && (
                        <p className="subtext" style={{ marginBottom: 12 }}>
                          {shopHint}
                        </p>
                      )}

                      <div className="shop-grid">
                        {shops.map((shop, index) => (
                          <div className="shop-card" key={shop.id || index}>
                            <div className="shop-top">
                              <div>
                                <strong>{shop.name}</strong>
                                <div className="shop-badge">
                                  ⭐ {Number(shop.rating || 0).toFixed(1)} • {shop.distanceMiles} miles away
                                </div>
                              </div>
                              <div className="shop-rank">#{index + 1}</div>
                            </div>

                            <div className="shop-meta">{shop.address}</div>
                            {shop.phone && <div className="shop-meta">{shop.phone}</div>}
                            <div className="shop-meta">
                              Based on {shop.userRatingCount || 0} customer ratings
                            </div>

                            <div className="shop-actions">
                              <a
                                className="shop-action primary"
                                href={shop.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open Map
                              </a>

                              {shop.phone && (
                                <a
                                  className="shop-action"
                                  href={`tel:${shop.phone}`}
                                >
                                  Call Shop
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>Helpful Videos</h3>
                      <div className="resource-grid">
                        {result.videoLinks?.map((video, index) => (
                          <div className="resource-item" key={index}>
                            <strong>{video.title}</strong>
                            <div className="link-row">
                              <a className="chip-link" href={video.youtube} target="_blank" rel="noreferrer">
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
