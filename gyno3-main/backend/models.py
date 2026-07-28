from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class AppointmentRequest(BaseModel):
    user_id: str = Field(..., description="The ID of the user booking the appointment")
    user_email: EmailStr = Field(..., description="The email address to send the confirmation to")
    appointment_datetime: datetime = Field(..., description="The UTC datetime of the appointment")
    timezone: str = Field(..., description="The user's timezone")
    consultation_mode: str = Field(..., description="Must be 'Video' or 'In-Person'")
    original_symptoms: str = Field(..., max_length=2000, description="Symptoms provided by user")

class AppointmentModel(AppointmentRequest):
    booking_status: str = "Confirmed"
    ai_status: str = "Processing"
    ai_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
