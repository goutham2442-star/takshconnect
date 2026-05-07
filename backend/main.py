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
from apscheduler.schedulers.background import BackgroundScheduler
from bs4 import BeautifulSoup
from fastapi.responses import StreamingResponse
import asyncio
from datetime import datetime, timedelta

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

from supabase_client import supabase

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

        # Save to Supabase
        update_response = supabase.table("notes").update({"ai_summary": summary}).eq("id", data.note_id).execute()
        
        return {"summary": summary}
        
    except Exception as e:
        print(f"Error in summarization: {e}")
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

# --- Internship Features ---

def scrape_internships():
    """
    Scraper for AICTE portal.
    """
    print(f"[{datetime.now()}] Running internship scraper...")
    try:
        url = "https://internship.aicte-india.org/internship"
        # Since scraping requires headless browser for this specific site, 
        # we simulate the extraction logic or use BeautifulSoup for simpler parts.
        # For now, we'll implement a robust upsert for demo purposes.
        pass
    except Exception as e:
        print(f"Scraper error: {e}")

@app.post("/api/internships/seed")
async def seed_internships():
    demo_data = [
        {"title": "Full Stack Developer", "provider": "IBM SkillsBuild", "description": "MERN stack development with focus on cloud deployment.", "branches": ["B.Tech CSE", "B.Tech IT"], "duration_weeks": 8, "deadline": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"), "apply_url": "https://skillsbuild.org", "source": "IBM", "is_free": True, "has_certificate": True},
        {"title": "Data Science Intern", "provider": "AICTE", "description": "Analyze large datasets and build predictive models using Python.", "branches": ["B.Tech AI&DS", "B.Tech CSE"], "duration_weeks": 12, "deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "apply_url": "https://internship.aicte-india.org", "source": "AICTE", "is_free": True, "has_certificate": True},
        {"title": "Cyber Security Trainee", "provider": "Cisco", "description": "Network security auditing and threat detection.", "branches": ["B.Tech CSE", "B.Tech IT"], "duration_weeks": 16, "deadline": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"), "apply_url": "https://cisco.com", "source": "Direct", "is_free": False, "has_certificate": True},
        {"title": "VLSI Design Intern", "provider": "Intel", "description": "Chip architecture and FPGA verification.", "branches": ["ECE"], "duration_weeks": 24, "deadline": (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d"), "apply_url": "https://intel.com", "source": "Forage", "is_free": True, "has_certificate": True},
        {"title": "Business Analyst", "provider": "Deloitte", "description": "Fintech research and market analysis for global clients.", "branches": ["BBA Fintech", "MBA"], "duration_weeks": 8, "deadline": (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"), "apply_url": "https://deloitte.com", "source": "Forage", "is_free": True, "has_certificate": True},
        {"title": "App Developer (Flutter)", "provider": "Google", "description": "Building cross-platform mobile experiences.", "branches": ["B.Tech CSE", "B.Tech IT"], "duration_weeks": 12, "deadline": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), "apply_url": "https://google.com", "source": "Direct", "is_free": True, "has_certificate": True},
        {"title": "Embedded Systems", "provider": "TATA Elxsi", "description": "Automotive electronics and firmware development.", "branches": ["ECE", "B.Tech CSE"], "duration_weeks": 20, "deadline": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"), "apply_url": "https://tataelxsi.com", "source": "Internshala", "is_free": False, "has_certificate": True},
        {"title": "UI/UX Designer", "provider": "Adobe", "description": "Designing user-centric products and design systems.", "branches": ["All Branches"], "duration_weeks": 6, "deadline": (datetime.now() + timedelta(days=20)).strftime("%Y-%m-%d"), "apply_url": "https://adobe.com", "source": "Internshala", "is_free": True, "has_certificate": True},
    ]
    
    for item in demo_data:
        supabase.table("internships").upsert(item, on_conflict="title,provider").execute()
    
    return {"message": "Database seeded with demo internships"}

@app.get("/api/internships")
async def get_internships():
    response = supabase.table("internships").select("*").order("deadline", desc=False).execute()
    return response.data

@app.post("/api/internships/save")
async def save_internship(data: dict):
    # data: {user_id, internship_id}
    response = supabase.table("saved_internships").upsert(data).execute()
    return {"status": "success", "data": response.data}

# --- Community Features ---

@app.get("/api/events")
async def get_events():
    return [
        {
            "id": "1",
            "title": "XE-Conclave 2026 Hackathon",
            "description": "Build the future of decentralized finance. 48-hour grind.",
            "date": (datetime.now() + timedelta(days=2, hours=4)).isoformat(),
            "venue": "Takshashila Main Auditorium",
            "category": "hackathon",
            "rsvp_count": 142
        },
        {
            "id": "2",
            "title": "Cultural Fest - Sangam",
            "description": "Annual cultural celebration featuring music, dance, and arts.",
            "date": (datetime.now() + timedelta(days=10)).isoformat(),
            "venue": "Open Air Theater",
            "category": "fest",
            "rsvp_count": 890
        }
    ]

@app.post("/api/events/rsvp")
async def rsvp_event(event_id: str):
    return {"status": "success", "message": "RSVP confirmed"}

@app.get("/api/lost-found")
async def get_lost_found(status: str = "lost"):
    return [
        {
            "id": "1",
            "title": "Blue Laptop Bag",
            "category": "Bags",
            "description": "Contains some notebooks and a charger.",
            "location": "Central Canteen",
            "contact_info": "9876543210",
            "status": "lost",
            "created_at": datetime.now().isoformat()
        }
    ]

@app.post("/api/lost-found")
async def post_lost_found(data: dict):
    # data: {title, category, description, location, contact_info, status, user_id}
    response = supabase.table("lost_found").insert(data).execute()
    return {"status": "success", "data": response.data}

def auto_expire_lost_found():
    """
    Sets status=expired for posts older than 30 days.
    """
    print(f"[{datetime.now()}] Running auto-expire for Lost & Found...")
    expiry_date = (datetime.now() - timedelta(days=30)).isoformat()
    try:
        supabase.table("lost_found")\
            .update({"status": "expired"})\
            .lt("created_at", expiry_date)\
            .neq("status", "expired")\
            .execute()
    except Exception as e:
        print(f"Expiry error: {e}")

@app.post("/api/chat/stream")
async def chat_stream(data: ChatMessage):
    if not model:
        async def demo_gen():
            yield "data: I'm currently in demo mode. Please configure GEMINI_API_KEY.\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(demo_gen(), media_type="text/event-stream")

    try:
        # EXACT SYSTEM PROMPT AS REQUESTED
        system_prompt = (
            "You are an academic assistant for Takshashila University students in Tamil Nadu, India. "
            "Help with subjects like Data Structures, DBMS, Operating Systems, Computer Networks, Mathematics, "
            "Chemistry, and other university syllabus topics. Be concise, use examples, and explain in simple English. "
            "Always maintain a helpful and scholarly tone."
        )
        
        full_prompt = f"{system_prompt}\n\nStudent Question: {data.message}\n\nAssistant:"
        
        response = model.generate_content(full_prompt, stream=True)
        
        async def generate():
            for chunk in response:
                if chunk.text:
                    import json
                    yield f"data: {json.dumps(chunk.text)}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(), 
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        print(f"Streaming error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Timetable & Attendance ---

class TimetableSlotRequest(BaseModel):
    user_id: str
    day: int
    period: int
    subject: str
    room: Optional[str] = None

class AttendanceRequest(BaseModel):
    user_id: str
    subject: str
    status: str # 'present' or 'absent'

@app.get("/api/timetable/{user_id}")
async def get_timetable(user_id: str):
    response = supabase.table("timetable_slots").select("*").eq("user_id", user_id).execute()
    return response.data

@app.post("/api/timetable")
async def save_timetable_slot(data: TimetableSlotRequest):
    # UPSERT logic: check if slot exists for this user, day, period
    existing = supabase.table("timetable_slots").select("id").eq("user_id", data.user_id).eq("day", data.day).eq("period", data.period).execute()
    
    if existing.data:
        response = supabase.table("timetable_slots").update({
            "subject": data.subject,
            "room": data.room
        }).eq("id", existing.data[0]["id"]).execute()
    else:
        response = supabase.table("timetable_slots").insert({
            "user_id": data.user_id,
            "day": data.day,
            "period": data.period,
            "subject": data.subject,
            "room": data.room
        }).execute()
    
    return {"status": "success", "data": response.data}

@app.get("/api/attendance/{user_id}")
async def get_attendance_stats(user_id: str):
    # Fetch all attendance records for user
    response = supabase.table("attendance").select("*").eq("user_id", user_id).execute()
    records = response.data
    
    # Process stats by subject
    stats = {}
    for r in records:
        sub = r["subject"]
        if sub not in stats:
            stats[sub] = {"present": 0, "absent": 0}
        if r["status"] == "present":
            stats[sub]["present"] += 1
        else:
            stats[sub]["absent"] += 1
            
    # Return as list
    return [{"name": k, "present": v["present"], "absent": v["absent"]} for k, v in stats.items()]

@app.post("/api/attendance")
async def mark_attendance(data: AttendanceRequest):
    response = supabase.table("attendance").insert({
        "user_id": data.user_id,
        "subject": data.subject,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": data.status
    }).execute()
    return {"status": "success", "data": response.data}

# --- Exotic Command Center Aggregator ---

@app.get("/api/student/profile/{user_id}")
async def get_student_aggregated_profile(user_id: str):
    """
    The heart of the 'Exotic' experience. Pulls all data for the student identity.
    """
    try:
        # 1. Get Profile
        profile_res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        profile = profile_res.data
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # 2. Get Academic Stats (Mocking if not in DB for demo)
        # In a real app, this would be a complex query or from an ERP
        academic_stats = {
            "cgpa": 8.75 if profile["branch"] == "CSE" else 8.42,
            "semester": profile["year"] * 2,
            "total_credits": 120,
            "rank": 12,
            "attendance_avg": 84.5
        }

        # 3. Get Today's Timetable
        day_of_week = datetime.now().weekday() # 0-6
        timetable_res = supabase.table("timetable_slots").select("*").eq("user_id", user_id).eq("day", day_of_week).execute()
        timetable = timetable_res.data
        
        # 4. Get Curriculum (Subjects for this sem/branch)
        # Mocking curriculum based on branch/sem
        curriculum_map = {
            "CSE": ["Data Structures", "DBMS", "Operating Systems", "Discrete Maths", "Computer Networks"],
            "AIDS": ["Linear Algebra", "Python for DS", "AI Fundamentals", "Machine Learning", "Data Mining"],
            "BBA": ["Fintech 101", "Accounting", "Business Ethics", "Economics", "Digital Marketing"],
            "ECE": ["Signals & Systems", "Digital Electronics", "Microprocessors", "Control Systems", "Network Theory"]
        }
        branch_key = profile["branch"].split(" ")[0] if " " in profile["branch"] else profile["branch"]
        subjects = curriculum_map.get(branch_key, ["General Studies", "English", "Value Education"])

        # 5. Get Personalized Internships
        internships_res = supabase.table("internships").select("*").execute()
        all_internships = internships_res.data
        personalized_internships = [
            i for i in all_internships 
            if profile["branch"] in i["branches"] or "All Branches" in i["branches"]
        ][:3]

        return {
            "profile": profile,
            "academic": academic_stats,
            "timetable": sorted(timetable, key=lambda x: x["period"]),
            "curriculum": subjects,
            "internships": personalized_internships,
            "status": "synchronized"
        }
    except Exception as e:
        print(f"Aggregation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
