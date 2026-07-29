from fastapi import APIRouter
from models.symptom_model import SymptomRequest
from services.gemini_service import analyze_symptoms

router = APIRouter()

EMERGENCY_KEYWORDS = {
    "chest pain", "shortness of breath", "fainting", "severe bleeding", 
    "difficulty breathing", "unconscious", "extreme abdominal pain", "severe pelvic pain"
}

@router.post("/analyze")
def analyze(request: SymptomRequest):
    print("Received symptoms:", request.symptoms, "Duration:", request.duration, "Severity:", request.severity, "Lang:", request.language)

    if len(request.symptoms) == 0:
        return {
            "error": "Please provide at least one symptom."
        }

    # Deterministic local safety override bypass
    has_emergency = False
    for sym in request.symptoms:
        sym_lower = sym.lower()
        if any(keyword in sym_lower for keyword in EMERGENCY_KEYWORDS):
            has_emergency = True
            break

    if has_emergency:
        recommendation = "EMERGENCY: Please proceed to the nearest emergency clinic or contact emergency services immediately."
        self_care = [
            "Do not wait for self-care remedies.",
            "Rest in a comfortable, safe position.",
            "Keep someone informed of your situation immediately."
        ]
        if request.language and request.language.lower() in ("hindi", "hi"):
            recommendation = "आपातकालीन: कृपया तुरंत निकटतम आपातकालीन क्लिनिक में जाएं या आपातकालीन चिकित्सा सेवाओं को कॉल करें।"
            self_care = [
                "स्व-देखभाल उपचारों की प्रतीक्षा न करें।",
                "एक सुरक्षित और आरामदायक स्थिति में आराम करें।",
                "किसी को तुरंत अपनी स्थिति के बारे में सूचित रखें।"
            ]
        return {
            "possible_conditions": ["Urgent Medical Attention Required"],
            "urgency": "Emergency",
            "recommendation": recommendation,
            "self_care": self_care
        }

    result = analyze_symptoms(
        symptoms=request.symptoms,
        duration=request.duration,
        severity=request.severity,
        language=request.language
    )

    return result