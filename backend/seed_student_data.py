import os
from dotenv import load_dotenv
from supabase_client import supabase
from datetime import datetime

load_dotenv()

def seed_demo_student(email="admin@takshashilauniv.ac.in"):
    print(f"Seeding academic data for {email}...")
    
    # 1. Ensure Profile exists (Create if not found)
    user_id = "00000000-0000-0000-0000-000000000000" # Fixed ID for demo
    profile_res = supabase.table("profiles").select("id").eq("id", user_id).execute()
    
    if not profile_res.data:
        print("Creating Master Demo Profile...")
        supabase.table("profiles").insert({
            "id": user_id,
            "name": "Admin Sricharan",
            "roll_number": "2026ADMIN01",
            "branch": "CSE",
            "year": 4,
            "email": email,
            "role": "admin"
        }).execute()
    
    # 2. Seed Timetable
    print("Seeding exotic timetable...")
    days = [0, 1, 2, 3, 4] # Mon-Fri
    subjects = ["Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Discrete Maths", "AI Fundamentals"]
    
    slots = []
    for day in days:
        for period in range(1, 6):
            slots.append({
                "user_id": user_id,
                "day": day,
                "period": period,
                "subject": subjects[(day + period) % len(subjects)],
                "room": f"LH-{100 + period}"
            })
    
    supabase.table("timetable_slots").upsert(slots).execute()

    # 3. Seed Internships
    print("Seeding internship board...")
    internships = [
        {"title": "Full Stack Developer", "provider": "IBM SkillsBuild", "description": "MERN stack projects.", "branches": ["CSE", "IT"], "duration_weeks": 8, "deadline": "2026-06-15", "apply_url": "https://skillsbuild.org", "source": "IBM", "is_free": True, "has_certificate": True},
        {"title": "AI & ML Intern", "provider": "Google AI", "description": "Deep learning research.", "branches": ["AI&DS", "CSE"], "duration_weeks": 12, "deadline": "2026-05-30", "apply_url": "https://aistudio.google.com", "source": "Google", "is_free": True, "has_certificate": True},
        {"title": "Data Analyst", "provider": "Forage", "description": "Business intelligence.", "branches": ["BBA", "B.Com"], "duration_weeks": 4, "deadline": "2026-06-01", "apply_url": "https://theforage.com", "source": "Forage", "is_free": True, "has_certificate": True},
    ]
    supabase.table("internships").upsert(internships).execute()

    print("Successfully seeded 'Exotic' academic data!")

if __name__ == "__main__":
    seed_demo_student()
