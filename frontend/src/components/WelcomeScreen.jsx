import React from "react";


const WelcomeScreen = ({ onStart }) => (
  <div className="welcome-screen">
    <div className="welcome-card">
      <div className="welcome-logo">
        {/* Simple SVG logo, you can replace with your own */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#667eea" />
          <text x="32" y="40" textAnchor="middle" fontSize="32" fill="#fff" fontWeight="bold">P</text>
        </svg>
      </div>
      <h1 className="welcome-title">Welcome to Plagiarism Detection!</h1>
      <div className="welcome-subtitle">
        <p>
          Plagiarism Detection is a fast and user-friendly tool to check for duplicate or similar content between documents.<br />
          Powered by advanced AI and semantic analysis for privacy and accuracy.
        </p>
        <p style={{ marginTop: 16, color: '#bbb', fontSize: '1rem' }}>
          When you're ready, click the button below to begin.
        </p>
      </div>
      <button className="welcome-btn" onClick={onStart}>
        <span role="img" aria-label="detect">🔎</span> Detect Plagiarism
      </button>
    </div>
  </div>
);

export default WelcomeScreen;
