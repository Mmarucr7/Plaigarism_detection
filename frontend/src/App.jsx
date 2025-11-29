
import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import HighlightedText from "./components/HighlightedText";
import MatchesTable from "./components/MatchesTable";
import WelcomeScreen from "./components/WelcomeScreen";
import HistoryTable from "./components/HistoryTable";


function App() {
  const [showApp, setShowApp] = useState(false);
  const [result, setResult] = useState(null);
  const [hasResults, setHasResults] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('check');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('plagiarism_history');
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.warn('Error reading history', e);
    }
  }, []);

  const handleResult = (data) => {
    setResult(data);
    setHasResults(!!data);

    // Persist history entry when metadata is provided by UploadForm
    try {
      if (data && data._meta) {
        const timestamp = data._meta.timestamp || new Date().toISOString();
        const score = data?.doc1?.plagiarismPercentage ?? (data.overallSimilarity ? data.overallSimilarity * 100 : null);
        const entry = {
          id: timestamp,
          suspiciousName: data._meta.suspiciousName || 'Suspicious',
          sourceName: data._meta.sourceName || 'Source',
          score: typeof score === 'number' ? Number(score) : null,
          timestamp,
        };

        setHistory((prev) => {
          const next = [entry, ...prev].slice(0, 100);
          try { localStorage.setItem('plagiarism_history', JSON.stringify(next)); } catch (e) { console.warn('Could not persist history', e); }
          return next;
        });
      }
    } catch (e) {
      console.warn('Error saving history', e);
    }
  };

  const handleReset = () => {
    setResult(null);
    setHasResults(false);
    // Increment uploadKey to force remount of UploadForm and clear selected files
    setUploadKey((k) => k + 1);
  };

  if (!showApp) {
    return <WelcomeScreen onStart={() => setShowApp(true)} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Plagiarism Detector</h1>
        <p>Advanced Sentence-BERT powered similarity checker</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            onClick={() => setActiveTab('check')}
            aria-pressed={activeTab === 'check'}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: activeTab === 'check' ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.18)',
              background: activeTab === 'check' ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            🔍 Check
          </button>
          <button
            onClick={() => setActiveTab('history')}
            aria-pressed={activeTab === 'history'}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: activeTab === 'history' ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.18)',
              background: activeTab === 'history' ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            📚 History
          </button>
        </div>
      </header>

      {activeTab === 'check' ? (
        <main className="main">
          <section className="card">
            <h2>📤 Upload Documents</h2>
            <UploadForm key={uploadKey} onResult={handleResult} />
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
      ) : (
        <main className="main">
          <section className="card">
            <h2>📚 Recent Checks</h2>
            <HistoryTable entries={history} />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
