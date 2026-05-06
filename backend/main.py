from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Optional
import fitz  # PyMuPDF
import requests
import tempfile

load_dotenv()

app = FastAPI(title="TakshConnect API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class NoteSummarizeRequest(BaseModel):
    file_url: str
    note_id: str

@app.get("/")
async def root():
    return {"message": "Welcome to TakshConnect API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "gemini_active": model is not None}

@app.post("/api/chat")
async def chat(data: ChatMessage):
    if not model:
        return {"reply": "I'm currently in demo mode. Please configure GEMINI_API_KEY for full AI capability."}
    
    try:
        prompt = f"You are TakshAssistant, a helpful AI tutor for Takshashila University students. Answer the following query concisely: {data.message}"
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notes/summarize")
async def summarize_note(data: NoteSummarizeRequest):
    if not model:
        return {"summary": "AI Summarization is currently disabled. Please configure GEMINI_API_KEY."}

    try:
        # Download PDF
        response = requests.get(data.file_url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to download file")

        # Extract Text
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        doc = fitz.open(tmp_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        os.unlink(tmp_path)

        # Summarize with Gemini
        prompt = f"Summarise this academic note in exactly 5 bullet points. Be concise:\n\n{text[:10000]}" # Limit text size
        ai_response = model.generate_content(prompt)
        summary = ai_response.text

        # In a real app, you'd save this to Supabase here
        # For now, we return it to the frontend
        return {"summary": summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/announcements")
async def get_announcements():
    return [
        {
            "id": 1,
            "tag": "New Launch",
            "title": "TakshConnect Beta Launch — Smart Notes + Internship Finder — Available for CSE Sem 4 students first",
            "date": "May 2026",
            "color": "border-maroon"
        },
        {
            "id": 2,
            "tag": "Internships",
            "title": "AICTE IBM SkillsBuild 2026 — 150+ new tech internships added, apply before June 15",
            "date": "June 15",
            "color": "border-gold"
        },
        {
            "id": 3,
            "tag": "Events",
            "title": "XE-Conclave 2026 Hackathon — Register via TakshConnect Events Board",
            "date": "April 27-30",
            "color": "border-maroon"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
