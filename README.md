#For Backend
cd backend
python -m venv .venv
#mac
source .venv/bin/activate
#windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

#For Frontend
cd frontend
npm i
npm run dev
