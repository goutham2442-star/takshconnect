import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

class MockSupabase:
    def __init__(self):
        self.table_name = ""
    def table(self, name):
        self.table_name = name
        return self
    def select(self, *args, **kwargs):
        return self
    def insert(self, *args, **kwargs):
        return self
    def update(self, *args, **kwargs):
        return self
    def upsert(self, *args, **kwargs):
        return self
    def eq(self, *args, **kwargs):
        return self
    def order(self, *args, **kwargs):
        return self
    def lt(self, *args, **kwargs):
        return self
    def neq(self, *args, **kwargs):
        return self
    def execute(self):
        class Result:
            def __init__(self, data):
                self.data = data
        
        data = []
        if self.table_name == "internships":
            from datetime import datetime, timedelta
            data = [
                {"id": "1", "title": "Full Stack Developer", "provider": "IBM SkillsBuild", "description": "MERN stack development.", "branches": ["B.Tech CSE", "B.Tech IT"], "duration_weeks": 8, "deadline": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"), "apply_url": "https://skillsbuild.org", "source": "IBM", "is_free": True, "has_certificate": True},
                {"id": "2", "title": "Data Science Intern", "provider": "AICTE", "description": "Python and ML projects.", "branches": ["B.Tech AI&DS", "B.Tech CSE"], "duration_weeks": 12, "deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "apply_url": "https://internship.aicte-india.org", "source": "AICTE", "is_free": True, "has_certificate": True},
            ]
        elif self.table_name == "events":
            from datetime import datetime, timedelta
            data = [
                {"id": "1", "title": "XE-Conclave 2026 Hackathon", "description": "48-hour grind.", "date": (datetime.now() + timedelta(days=2)).isoformat(), "venue": "Main Auditorium", "category": "hackathon", "rsvp_count": 142},
            ]
        elif self.table_name == "profiles":
            # Return an admin profile for the demo user
            data = {"id": "demo-user-id", "name": "Admin Sricharan", "email": "admin@takshashilauniv.ac.in", "roll_number": "2026ADMIN01", "branch": "CSE", "year": 4, "role": "admin"}
        elif self.table_name == "timetable_slots":
            data = [
                {"period": 1, "subject": "Data Structures", "room": "LH-101"},
                {"period": 2, "subject": "DBMS", "room": "LH-102"},
                {"period": 3, "subject": "Operating Systems", "room": "LH-103"},
            ]
        elif self.table_name == "lost_found":
            data = [
                {"id": "1", "title": "Blue Laptop Bag", "category": "Bags", "description": "Found in Canteen", "location": "Canteen", "contact_info": "9876543210", "status": "lost", "created_at": "2026-05-01"}
            ]
        elif self.table_name == "internships":
            from datetime import datetime, timedelta
            data = [
                {"id": "1", "title": "Full Stack Developer", "provider": "IBM SkillsBuild", "description": "MERN stack development.", "branches": ["CSE", "IT"], "duration_weeks": 8, "deadline": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"), "apply_url": "https://skillsbuild.org", "source": "IBM", "is_free": True, "has_certificate": True},
                {"id": "2", "title": "Data Science Intern", "provider": "AICTE", "description": "Python and ML projects.", "branches": ["AIDS", "CSE"], "duration_weeks": 12, "deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "apply_url": "https://internship.aicte-india.org", "source": "AICTE", "is_free": True, "has_certificate": True},
            ]
        
        return Result(data)

    def single(self):
        class SingleResult:
            def __init__(self, data):
                self.data = data
            def execute(self):
                return self
        
        # Return admin profile for any .single() call on profiles in mock
        data = {"id": "demo-user-id", "name": "Admin Sricharan", "email": "admin@takshashilauniv.ac.in", "roll_number": "2026ADMIN01", "branch": "CSE", "year": 4, "role": "admin"}
        return SingleResult(data)

try:
    if not url or not key:
        print("Warning: Using MockSupabase client.")
        supabase = MockSupabase()
    else:
        supabase: Client = create_client(url, key)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}. Using MockSupabase.")
    supabase = MockSupabase()
