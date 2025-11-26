
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
import torch
import re
import io
import pdfplumber
import docx

app = FastAPI(title="Sentence-BERT Plagiarism Detector")

# CORS for local React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a stronger paraphrase-focused model
model = SentenceTransformer("paraphrase-mpnet-base-v2")


def read_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


def read_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
    return text


def read_docx(file_bytes: bytes) -> str:
    file_like = io.BytesIO(file_bytes)
    document = docx.Document(file_like)
    return "\n".join(p.text for p in document.paragraphs)


def read_file_content(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().split(".")[-1] if "." in filename else ""
    if ext == "pdf":
        return read_pdf(file_bytes)
    elif ext == "docx":
        return read_docx(file_bytes)
    else:
        # default: treat as plain text
        return read_txt(file_bytes)


def split_into_sentences(text: str):
    text = text.replace("\n", " ")
    parts = re.split(r"([.!?])", text)
    sentences = []
    current = ""
    for chunk in parts:
        if chunk in [".", "!", "?"]:
            current += chunk + " "
            sentences.append(current.strip())
            current = ""
        else:
            current += chunk
    if current.strip():
        sentences.append(current.strip())
    sentences = [s for s in sentences if len(s.strip()) > 2]
    return sentences


def compute_plagiarism(doc1_text: str, doc2_text: str):
    exact_thresh = 0.90
    paraphrase_thresh = 0.80

    sents1 = split_into_sentences(doc1_text)
    sents2 = split_into_sentences(doc2_text)

    if not sents1 or not sents2:
        return {
            "doc1": {"segments": [], "plagiarismPercentage": 0.0},
            "overallSimilarity": 0.0,
        }

    emb1 = model.encode(sents1, convert_to_tensor=True, normalize_embeddings=True)
    emb2 = model.encode(sents2, convert_to_tensor=True, normalize_embeddings=True)

    sim_matrix = util.cos_sim(emb1, emb2)

    segments = []
    total_chars = sum(len(s) for s in sents1)
    plag_chars = 0

    for i, s1 in enumerate(sents1):
        row = sim_matrix[i]
        best_idx = int(torch.argmax(row))
        best_score = float(row[best_idx].item())
        best_match = sents2[best_idx]

        if best_score >= exact_thresh:
            match_type = "exact"
        elif best_score >= paraphrase_thresh:
            match_type = "paraphrased"
        else:
            match_type = "original"

        if match_type != "original":
            plag_chars += len(s1)

        segments.append(
            {
                "text": s1,
                "similarity": best_score,
                "match": best_match,
                "type": match_type,
                "plagiarized": match_type != "original",
            }
        )

    plagiarism_percentage = (plag_chars / total_chars * 100.0) if total_chars > 0 else 0.0

    # Overall document-level similarity using mean-pooled embeddings
    doc1_mean = torch.mean(emb1, dim=0, keepdim=True)
    doc2_mean = torch.mean(emb2, dim=0, keepdim=True)
    overall_sim = float(util.cos_sim(doc1_mean, doc2_mean)[0][0].item())

    return {
        "doc1": {
            "segments": segments,
            "plagiarismPercentage": plagiarism_percentage,
        },
        "overallSimilarity": overall_sim,
    }


@app.post("/api/check")
async def check_plagiarism(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
):
    file1_bytes = await file1.read()
    file2_bytes = await file2.read()

    text1 = read_file_content(file1_bytes, file1.filename)
    text2 = read_file_content(file2_bytes, file2.filename)

    result = compute_plagiarism(text1, text2)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
