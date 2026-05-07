import os
from dotenv import load_dotenv
from supabase_client import supabase
from datetime import datetime

load_dotenv()

def seed_demo_student(email="admin@takshashilauniv.ac.in"):
    print(f"Seeding academic data for {email}...")
    
    # 1. Get User ID
    # In a real scenario we'd look up the user by email
    # For demo, we'll assume the first profile found or a specific ID
    profile_res = supabase.table("profiles").select("id").eq("email", email).execute()
    if not profile_res.data:
        print(f"User {email} not found. Please register first.")
        return
    
    user_id = profile_res.data[0]["id"]

    # 2. Seed Timetable
    print("Seeding timetable...")
    days = [0, 1, 2, 3, 4] # Mon-Fri
    subjects = ["DSA", "DBMS", "OS", "CN", "Maths", "AI", "Soft Skills"]
    
    slots = []
    for day in days:
        for period in range(1, 6): # 5 periods a day
            slots.append({
                "user_id": user_id,
                "day": day,
                "period": period,
                "subject": subjects[(day + period) % len(subjects)],
                "room": f"LH-{100 + period}"
            })
    
    supabase.table("timetable_slots").upsert(slots, on_conflict="user_id,day,period").execute()

    # 3. Seed Attendance
    print("Seeding attendance...")
    attendance_records = []
    for sub in subjects:
        # 10 records per subject
        for i in range(10):
            attendance_records.append({
                "user_id": user_id,
                "subject": sub,
                "date": f"2026-04-{10+i}",
                "status": "present" if i % 4 != 0 else "absent"
            })
    
    supabase.table("attendance").insert(attendance_records).execute()

    print("Successfully seeded 'Exotic' academic data!")

if __name__ == "__main__":
    seed_demo_student()
