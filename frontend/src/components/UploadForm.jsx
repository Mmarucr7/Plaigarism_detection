
import React, { useState } from "react";
import { checkPlagiarism } from "../api/api";

const UploadForm = ({ onResult }) => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");

  const handleFileChange = (e, fileNum) => {
    const file = e.target.files[0];
    if (fileNum === 1) {
      setFile1(file || null);
      setFileName1(file?.name || "");
    } else {
      setFile2(file || null);
      setFileName2(file?.name || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    onResult(null);

    if (!file1 || !file2) {
      setError("⚠️ Please upload both documents to proceed.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      setLoading(true);
      const data = await checkPlagiarism(formData);
      // Attach metadata so App can persist history entries
      const withMeta = {
        ...data,
        _meta: {
          suspiciousName: fileName1 || file1?.name || 'Suspicious',
          sourceName: fileName2 || file2?.name || 'Source',
          timestamp: new Date().toISOString(),
        },
      };
      onResult(withMeta);
    } catch (err) {
      console.error(err);
      setError("❌ Error checking plagiarism. Please ensure the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="field">
        <label>📄 Suspicious Document</label>
        <p className="field-description">Upload the document you want to check for plagiarism</p>
        <input
          type="file"
          accept=".txt,.md,.csv,.json,.pdf,.docx"
          onChange={(e) => handleFileChange(e, 1)}
        />
        {fileName1 && <div className="file-info">{fileName1}</div>}
      </div>
      <div className="field">
        <label>📚 Source Document</label>
        <p className="field-description">Upload the reference document to compare against</p>
        <input
          type="file"
          accept=".txt,.md,.csv,.json,.pdf,.docx"
          onChange={(e) => handleFileChange(e, 2)}
        />
        {fileName2 && <div className="file-info">{fileName2}</div>}
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading} className="primary-btn">
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing Documents...
          </>
        ) : (
          "🔍 Check Plagiarism"
        )}
      </button>
    </form>
  );
};

export default UploadForm;
