import json
import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_symptoms(symptoms, duration="unknown", severity="moderate", language="English"):

    try:

        symptom_text = ", ".join(symptoms)

        prompt = f"""
You are an AI women's health assistant.

Symptoms: {symptom_text}
Duration: {duration}
Severity: {severity}

Based on these symptoms and context:

1. Suggest possible conditions.
2. Assign urgency level:
   - Low
   - Medium
   - High
3. Provide medical recommendation.
4. Provide 5 self-care tips.

IMPORTANT:
This is not a diagnosis.

Return ALL textual and string outputs translated into the requested language: {language}.

Return ONLY valid JSON matching this schema:
{{
 "possible_conditions": [],
 "urgency": "",
 "recommendation": "",
 "self_care": []
}}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return json.loads(response.text)

    except Exception as e:

        print("Gemini Error:", e)

        # Standard English fallback
        fallback = {
            "possible_conditions": [],
            "urgency": "Service Busy",
            "recommendation": "Our AI analysis service is currently experiencing high demand. Please try again shortly.",
            "self_care": [
                "Stay hydrated",
                "Monitor your symptoms",
                "Seek medical attention if symptoms worsen"
            ]
        }

        # Translating standard fallback for Hindi users
        if language and language.lower() in ("hindi", "hi"):
            fallback = {
                "possible_conditions": [],
                "urgency": "व्यस्त सेवा",
                "recommendation": "हमारी एआई विश्लेषण सेवा वर्तमान में उच्च मांग का अनुभव कर रही है। कृपया कुछ समय बाद पुनः प्रयास करें।",
                "self_care": [
                    "हाइड्रेटेड रहें",
                    "अपने लक्षणों की निगरानी करें",
                    "लक्षण बिगड़ने पर चिकित्सा सहायता लें"
                ]
            }

        return fallback