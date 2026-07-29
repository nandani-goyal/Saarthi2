from pydantic import BaseModel
from typing import List, Optional

class SymptomRequest(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = "unknown"
    severity: Optional[str] = "moderate"
    language: Optional[str] = "English"