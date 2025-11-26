
import React from "react";

const MatchesTable = ({ segments }) => {
  if (!segments) return null;
  const rows = segments.filter((s) => s.type !== "original");
  if (rows.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#999',
        background: '#f9f9fb',
        borderRadius: '10px',
        marginTop: '12px'
      }}>
        <p>✓ No suspicious similarities detected. Document appears original!</p>
      </div>
    );
  }

  return (
    <table className="matches-table">
      <thead>
        <tr>
          <th style={{ width: '5%' }}>#</th>
          <th style={{ width: '35%' }}>Sentence from Doc A</th>
          <th style={{ width: '35%' }}>Best Match from Doc B</th>
          <th style={{ width: '15%' }}>Similarity</th>
          <th style={{ width: '10%' }}>Type</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((seg, idx) => (
          <tr key={idx}>
            <td><strong>{idx + 1}</strong></td>
            <td title={seg.text}>{seg.text.substring(0, 60)}{seg.text.length > 60 ? '...' : ''}</td>
            <td title={seg.match}>{seg.match.substring(0, 60)}{seg.match.length > 60 ? '...' : ''}</td>
            <td>
              <span className="similarity-badge">
                {(seg.similarity * 100).toFixed(1)}%
              </span>
            </td>
            <td>
              <span className={`type-badge ${seg.type}`}>
                {seg.type === "exact" ? "🔴 Exact" : "🟡 Paraphrased"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MatchesTable;
