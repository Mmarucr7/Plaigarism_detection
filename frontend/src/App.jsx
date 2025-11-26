
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import HighlightedText from "./components/HighlightedText";
import MatchesTable from "./components/MatchesTable";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>Plagiarism Detector</h1>
        <p>Sentence-BERT powered similarity checker</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Upload Documents</h2>
          <UploadForm onResult={setResult} />
        </section>

        {result && (
          <>
            <section className="card">
              <h2>Summary</h2>
              <div className="summary">
                <div>
                  <span className="summary-label">Plagiarism (Doc A):</span>
                  <span className="summary-value">
                    {result.doc1.plagiarismPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="summary-label">Overall Similarity:</span>
                  <span className="summary-value">
                    {(result.overallSimilarity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </section>

            <section className="card">
              <h2>Highlighted Document A</h2>
              <p>
                <span className="legend-box exact" /> Exact match
              </p>
              <p>
                <span className="legend-box paraphrased" /> Paraphrased match
              </p>
              <p>
                <span className="legend-box original" /> Original text
              </p>
              <HighlightedText segments={result.doc1.segments} />
            </section>

            <section className="card">
              <h2>Matched Sentences</h2>
              <MatchesTable segments={result.doc1.segments} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
