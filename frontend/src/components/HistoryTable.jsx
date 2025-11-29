import React from 'react';

const HistoryTable = ({ entries = [] }) => {
  if (!entries || entries.length === 0) {
    return <div style={{ color: '#555' }}>No previous checks found.</div>;
  }

  return (
    <table className="matches-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}>#</th>
          <th>Suspicious Document</th>
          <th>Source Document</th>
          <th>Plagiarism %</th>
          <th>Checked At</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e, idx) => (
          <tr key={e.id || idx}>
            <td>{idx + 1}</td>
            <td>{e.suspiciousName || '—'}</td>
            <td>{e.sourceName || '—'}</td>
            <td>
              {typeof e.score === 'number' && !isNaN(e.score)
                ? `${Number(e.score).toFixed(1)}%`
                : '—'}
            </td>
            <td style={{ color: '#777', fontSize: '0.9rem' }}>
              {e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
