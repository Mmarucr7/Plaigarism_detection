# 📋 Plagiarism Detector

### Advanced Sentence-BERT Powered Document Similarity Checker

This project is a full-stack plagiarism detection web application that compares two documents and identifies **exact matches**, **paraphrased content**, and **original text** using state-of-the-art transformer embeddings.

Built with:

* **FastAPI + Python** for backend ML processing
* **Sentence-BERT (paraphrase-mpnet-base-v2)** for semantic similarity
* **React + Vite** for the interactive frontend
* **PDF / DOCX / TXT** support with sentence-level highlighting

Ideal for academic use, NLP learning, or demonstration of modern semantic search techniques.

---

## 🚀 Features

### 🔹 **Semantic Plagiarism Detection**

* Detects more than copy-paste catches **paraphrased text** using neural embeddings.
* Classifies every sentence into:

  * 🔴 **Exact Match** — identical content
  * 🟡 **Paraphrased Match** — meaning preserved
  * 🔵 **Original** — unique text

### 🔹 **Multi-Format File Support**

Upload any combination of:

* `.pdf`
* `.docx`
* `.txt` / `.md` / `.csv` / `.json`

### 🔹 **Interactive Highlighting**

The frontend visually highlights suspicious sentences with hover-based details:

* Similarity score
* Matched sentence from source document
* Match type

### 🔹 **Detailed Match Table**

A clean table summarizing:

* Sentence pairs (Doc A → Doc B)
* Similarity percentage
* Match classification

### 🔹 **Plagiarism Percentage**

Automatically computes:

* **Overall similarity score**
* **Plagiarism percentage** (based on characters in matched sentences)

### 🔹 **Local History Tracking**

Recent checks are stored in `localStorage`, allowing:

* Quick re-view of past comparisons
* Table of previous scores, filenames, and timestamps

---

## 🧠 Tech Stack

### **Backend**

* **Python 3.9+**
* **FastAPI**
* **Uvicorn**
* **SentenceTransformers** (`paraphrase-mpnet-base-v2`)
* **PyTorch**
* **pdfplumber** (PDF extraction)
* **python-docx** (DOCX extraction)

### **Frontend**

* **React**
* **Vite**
* **Vanilla CSS**

---

## 🔍 How It Works (Algorithm)

1. **Extract Text**

   * PDF → `pdfplumber`
   * DOCX → `python-docx`
   * TXT/other → UTF-8 decode

2. **Split Into Sentences**

   * Custom regex splitter (upgradeable to NLTK/spaCy)

3. **Embed with Sentence-BERT**

   ```py
   model = SentenceTransformer("paraphrase-mpnet-base-v2")
   embeddings = model.encode(sentences, normalize_embeddings=True)
   ```

4. **Compute Similarity Matrix**

   * Full `N × M` cosine similarity across sentences
   * Highest scoring match determines label

5. **Classify Each Sentence**

   * `similarity ≥ 0.90` → **Exact**
   * `0.80 ≤ similarity < 0.90` → **Paraphrased**
   * `< 0.80` → **Original**

6. **Compute Plagiarism Percentage**

   ```text
   sum(characters of plagiarized sentences) / total characters
   ```

7. **Compute Document-Level Similarity**

   * Mean-pooled embeddings → cosine similarity

---

## 📡 API Documentation

### **POST** `/api/check`

Upload two documents and receive a detailed plagiarism analysis.

#### **Request (multipart/form-data)**

| Field | Type | Description                   |
| ----- | ---- | ----------------------------- |
| file1 | File | Suspicious / student document |
| file2 | File | Source / reference document   |

#### **Sample Request**

```bash
curl -X POST http://localhost:8000/api/check \
  -F "file1=@documentA.pdf" \
  -F "file2=@documentB.pdf"
```

#### **Response JSON**

```json
{
  "doc1": {
    "segments": [
      {
        "text": "This is an example sentence.",
        "similarity": 0.92,
        "match": "This is an example sentence.",
        "type": "exact",
        "plagiarized": true
      }
    ],
    "plagiarismPercentage": 42.5
  },
  "overallSimilarity": 0.76
}
```

---

## 🖥️ Running the Backend (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend will run at:
👉 **[http://localhost:8000](http://localhost:8000)**

Swagger docs available at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🧩 Running the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📷 Screenshots (Recommended)

*Add screenshots here after you run the app:*

```
/screenshots
  upload-form.png
  analysis-summary.png
  highlighted-doc.png
  matches-table.png
  history-tab.png
```

---

## 🛠️ Project Structure

```
📁 backend
│   ├── app
│   │    └── main.py          # FastAPI app + embeddings logic
│   ├── requirements.txt
│   └── ...
📁 frontend
│   ├── src/
│   │    ├── components/
│   │    ├── api/
│   │    └── App.jsx
│   └── ...
📁 Source Document
📁 Suspicious Document
README.md
```

---

## 🧪 Future Improvements

* Add NLTK / spaCy **sentence segmentation**
* Add **file size limits** and **corrupt file handling**
* Improve speed using:

  * `semantic_search` instead of full NxM matrix
  * batching embeddings for very large documents
* Add **dual-document highlighting**
* Deploy backend to Render / Railway and frontend to Netlify

## ⭐ Contributing

Pull requests and suggestions are welcome!

---
