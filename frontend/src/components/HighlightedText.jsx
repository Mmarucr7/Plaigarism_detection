
import React, { useState } from "react";

const HighlightedText = ({ segments }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!segments || segments.length === 0) return <p>No content to display.</p>;

  const getClassName = (seg) => {
    if (seg.type === "exact") return "exact";
    if (seg.type === "paraphrased") return "paraphrased";
    return "original";
  };

  return (
    <>
      <p className="doc-text">
        {segments.map((seg, idx) => (
          <span
            key={idx}
            className={getClassName(seg)}
            title={
              seg.type !== "original"
                ? `Type: ${seg.type.toUpperCase()}\nSimilarity: ${(seg.similarity * 100).toFixed(
                    1
                  )}%\n\nMatch: ${seg.match}`
                : ""
            }
            style={{
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={() => seg.type !== "original" && setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {seg.text + " "}
          </span>
        ))}
      </p>
      {hoveredIndex !== null && segments[hoveredIndex]?.type !== "original" && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f9f9fb',
          borderRadius: '8px',
          borderLeft: '4px solid #667eea',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: '#555'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Match Details:</strong>
          </div>
          <div>
            <strong>Type:</strong> {segments[hoveredIndex].type === "exact" ? "🔴 Exact Match" : "🟡 Paraphrased"}
          </div>
          <div>
            <strong>Similarity:</strong> {(segments[hoveredIndex].similarity * 100).toFixed(1)}%
          </div>
          <div style={{ marginTop: '8px' }}>
            <strong>Matched Text:</strong>
          </div>
          <div style={{
            background: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontStyle: 'italic',
            color: '#667eea',
            marginTop: '4px'
          }}>
            "{segments[hoveredIndex].match}"
          </div>
        </div>
      )}
    </>
  );
};

export default HighlightedText;
