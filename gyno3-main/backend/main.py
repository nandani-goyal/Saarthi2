from fastapi import FastAPI, Query, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import math
import requests
import random
import urllib.parse
from typing import List

# Import our new modules
from models import AppointmentRequest, AppointmentModel
from database import appointments_collection, users_collection
from ai_service import generate_consultation_summary
from email_service import send_appointment_confirmation

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development use only. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Existing Gynecologists Endpoint ---

FALLBACK_DOCTORS = [
    {
        "id": "mock_1",
        "name": "Dr. Radhika Sen",
        "clinic": "Lotus Women's Clinic",
        "city": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "rating": 4.7,
        "speciality": "PCOS Expert",
        "timing": "Mon-Sat, 10AM-6PM",
        "isOpen": True,
        "address": "Delhi, India"
    },
    {
        "id": "mock_2",
        "name": "Dr. Nidhi Kapoor",
        "clinic": "Bliss Women's Hospital",
        "city": "Mumbai",
        "lat": 19.0760,
        "lng": 72.8777,
        "rating": 4.8,
        "speciality": "Pregnancy Support",
        "timing": "Mon-Fri, 9AM-5PM",
        "isOpen": True,
        "address": "Mumbai, India"
    },
    {
        "id": "mock_3",
        "name": "Dr. Anjali Sharma",
        "clinic": "Care Women's Center",
        "city": "Bangalore",
        "lat": 12.9716,
        "lng": 77.5946,
        "rating": 4.6,
        "speciality": "Infection Specialist",
        "timing": "Tue-Sun, 11AM-7PM",
        "isOpen": True,
        "address": "Bangalore, India"
    },
]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.get("/gynecologists")
def get_nearby_gynecologists(lat: float = Query(...), lng: float = Query(...), radius_km: float = 10):
    radius_m = int(radius_km * 1000)
    overpass_url = "https://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["amenity"="clinic"](around:{radius_m},{lat},{lng});
      node["amenity"="hospital"](around:{radius_m},{lat},{lng});
      node["healthcare"="gynaecologist"](around:{radius_m},{lat},{lng});
    );
    out body;
    """
    
    nearby_clinics = []
    try:
        url = f"{overpass_url}?data={urllib.parse.quote(overpass_query)}"
        headers = {'User-Agent': 'GynoConnectApp/1.0 (Contact: hello@saarthi.health)'}
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name")
            if not name: continue
                
            e_lat, e_lng = element.get("lat"), element.get("lon")
            distance = haversine(lat, lng, e_lat, e_lng)
            
            rating = round(random.uniform(4.0, 5.0), 1)
            street, city = tags.get("addr:street", ""), tags.get("addr:city", "")
            address = f"{street}, {city}".strip(", ")
            if not address: address = "Address unavailable"
                
            opening_hours = tags.get("opening_hours")
            is_open = True
            timing = opening_hours if opening_hours else "9:00 AM - 8:00 PM"
            if not opening_hours:
                is_open = random.choice([True, True, True, False])
                
            nearby_clinics.append({
                "id": str(element["id"]), "name": name, "clinic": name, "city": city,
                "address": address, "lat": e_lat, "lng": e_lng, "distance_km": round(distance, 2),
                "rating": rating, "isOpen": is_open, "timing": timing,
                "speciality": "Gynecology & Women's Health", "phone": tags.get("phone", "+91-XXXXXXXXXX")
            })
            
    except Exception as e:
        print(f"Error fetching from Overpass API: {e}")
        pass
        
    if len(nearby_clinics) == 0:
        for doc in FALLBACK_DOCTORS:
            distance = haversine(lat, lng, doc["lat"], doc["lng"])
            doc_with_dist = doc.copy()
            doc_with_dist["distance_km"] = round(distance, 2)
            nearby_clinics.append(doc_with_dist)

    nearby_clinics = sorted(nearby_clinics, key=lambda d: d["distance_km"])
    return nearby_clinics[:15]


@app.get("/api/users/current")
async def get_current_db_user():
    """
    Fetches a user document from the MongoDB 'users' collection.
    If no user exists yet in the database, returns a default active user.
    """
    user = await users_collection.find_one({})
    if user:
        return {
            "id": str(user["_id"]),
            "name": user.get("name", "Registered User"),
            "email": user.get("email", "user@saarthi.health")
        }
    return {
        "id": "64abc1234567890abcdef123",
        "name": "Saarthi User",
        "email": "hello@saarthi.health"
    }


# --- New Appointment Booking Endpoint ---

async def background_ai_task(appointment_id: str, symptoms: str):
    """
    Runs in the background to summarize the symptoms and update MongoDB.
    """
    ai_result = await generate_consultation_summary(symptoms)
    
    # User Request: If AI fails, fallback to the exact original symptoms.
    final_summary = ai_result["summary"]
    if ai_result["status"] == "Failed":
        final_summary = symptoms

    await appointments_collection.update_one(
        {"_id": appointment_id},
        {"$set": {
            "ai_summary": final_summary,
            "ai_status": ai_result["status"]
        }}
    )

@app.post("/api/appointments")
async def book_appointment(req: AppointmentRequest, background_tasks: BackgroundTasks):
    from datetime import datetime, timezone
    
    # 1. Validation (Production checks)
    if not req.user_id:
        raise HTTPException(status_code=400, detail="Authenticated user is required.")
        
    if not req.original_symptoms or len(req.original_symptoms.strip()) == 0:
        raise HTTPException(status_code=400, detail="Symptoms cannot be empty.")
        
    if req.consultation_mode not in ["Video", "In-Person"]:
        raise HTTPException(status_code=400, detail="Consultation mode must be Video or In-Person.")
        
    # Check if appointment is in the past
    now_utc = datetime.now(timezone.utc)
    if req.appointment_datetime < now_utc:
        raise HTTPException(status_code=400, detail="Cannot book an appointment in the past.")

    # 2. Duplicate Prevention
    existing_appointment = await appointments_collection.find_one({
        "user_id": req.user_id,
        "appointment_datetime": req.appointment_datetime
    })
    
    if existing_appointment:
        raise HTTPException(status_code=409, detail="You already have an appointment booked for this exact date and time.")

    # 3. Save initial record to MongoDB
    new_appointment = AppointmentModel(**req.model_dump())
    new_doc = new_appointment.model_dump()
    result = await appointments_collection.insert_one(new_doc)
    appointment_id = result.inserted_id
    
    # 4. Trigger background task for AI summarization
    background_tasks.add_task(background_ai_task, appointment_id, req.original_symptoms)
    
    # 5. Send Email Confirmation
    friendly_date = req.appointment_datetime.strftime("%B %d, %Y at %I:%M %p") + " UTC"
    send_appointment_confirmation(req.user_email, friendly_date, req.consultation_mode)

    return {
        "message": "Appointment confirmed successfully",
        "appointment_id": str(appointment_id),
        "status": "Confirmed"
    }
