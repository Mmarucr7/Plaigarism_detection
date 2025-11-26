
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import HighlightedText from "./components/HighlightedText";
import MatchesTable from "./components/MatchesTable";

function App() {
  const [result, setResult] = useState(null);
  const [hasResults, setHasResults] = useState(false);

  const handleResult = (data) => {
    setResult(data);
    setHasResults(!!data);
  };

  const handleReset = () => {
    setResult(null);
    setHasResults(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Plagiarism Detector</h1>
        <p>Advanced Sentence-BERT powered similarity checker</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>📤 Upload Documents</h2>
          <UploadForm onResult={handleResult} />
        </section>

        {hasResults && result && (
          <>
            <section className="card">
              <h2>📊 Analysis Summary</h2>
              <div className="summary">
                <div>
                  <span className="summary-label">Plagiarism Detected (Doc A)</span>
                  <span className="summary-value">
                    {result.doc1.plagiarismPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="summary-label">Overall Similarity Score</span>
                  <span className="summary-value">
                    {(result.overallSimilarity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </section>

            <section className="card">
              <h2>🔍 Document Analysis Legend</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '16px' }}>
                <div className="legend-item">
                  <span className="legend-box exact" />
                  <span>Exact Match - Identical text</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box paraphrased" />
                  <span>Paraphrased Match - Similar meaning</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box original" />
                  <span>Original Text - No match found</span>
                </div>
              </div>
            </section>

            <section className="card">
              <h2>📝 Highlighted Document A</h2>
              <HighlightedText segments={result.doc1.segments} />
            </section>

            <section className="card">
              <h2>🎯 Matched Sentences</h2>
              <MatchesTable segments={result.doc1.segments} />
            </section>

            <section style={{ textAlign: 'center' }}>
              <button 
                onClick={handleReset}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#667eea',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                ↺ Check Another Document
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
