from fastapi import APIRouter
from models.symptom_model import SymptomRequest
from services.gemini_service import analyze_symptoms

router = APIRouter()

@router.post("/analyze")
def analyze(request: SymptomRequest):

    print("Received symptoms:", request.symptoms)

    if len(request.symptoms) == 0:
        return {
            "error": "Please provide at least one symptom."
        }

    result = analyze_symptoms(
        request.symptoms
    )

    return result