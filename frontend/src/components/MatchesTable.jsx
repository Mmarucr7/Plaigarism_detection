
import React from "react";

const MatchesTable = ({ segments }) => {
  if (!segments) return null;
  const rows = segments.filter((s) => s.type !== "original");
  if (rows.length === 0) {
    return <p>No highly similar sentences detected.</p>;
  }

  return (
    <table className="matches-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Sentence (Doc A)</th>
          <th>Best Match (Doc B)</th>
          <th>Similarity</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((seg, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{seg.text}</td>
            <td>{seg.match}</td>
            <td>{(seg.similarity * 100).toFixed(1)}%</td>
            <td>{seg.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MatchesTable;
