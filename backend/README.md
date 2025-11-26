
# Backend - Sentence-BERT Plagiarism Detector (Improved)

## Features
- Uses `paraphrase-mpnet-base-v2` for better paraphrase detection
- Classifies matches as: exact, paraphrased, original
- Supports .txt, .pdf, .docx uploads

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
