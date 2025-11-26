
import React from "react";

const HighlightedText = ({ segments }) => {
  if (!segments || segments.length === 0) return <p>No content.</p>;

  const getClassName = (seg) => {
    if (seg.type === "exact") return "exact";
    if (seg.type === "paraphrased") return "paraphrased";
    return "original";
  };

  return (
    <p className="doc-text">
      {segments.map((seg, idx) => (
        <span
          key={idx}
          className={getClassName(seg)}
          title={
            seg.type !== "original"
              ? `Type: ${seg.type}\nSimilarity: ${(seg.similarity * 100).toFixed(
                  1
                )}%\nMatch: ${seg.match}`
              : ""
          }
        >
          {seg.text + " "}
        </span>
      ))}
    </p>
  );
};

export default HighlightedText;
