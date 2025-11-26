
import React, { useState } from "react";
import { checkPlagiarism } from "../api/api";

const UploadForm = ({ onResult }) => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    onResult(null);

    if (!file1 || !file2) {
      setError("Please upload both documents.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      setLoading(true);
      const data = await checkPlagiarism(formData);
      onResult(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="field">
        <label>Document A (suspected)</label>
        <input
          type="file"
          accept=".txt,.md,.csv,.json,.pdf,.docx"
          onChange={(e) => setFile1(e.target.files[0] || null)}
        />
      </div>
      <div className="field">
        <label>Document B (reference)</label>
        <input
          type="file"
          accept=".txt,.md,.csv,.json,.pdf,.docx"
          onChange={(e) => setFile2(e.target.files[0] || null)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading} className="primary-btn">
        {loading ? "Checking..." : "Check Plagiarism"}
      </button>
    </form>
  );
};

export default UploadForm;
