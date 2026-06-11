import json
import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_symptoms(symptoms):

    try:

        symptom_text = ", ".join(symptoms)

        prompt = f"""
You are an AI women's health assistant.

Symptoms:
{symptom_text}

Based on these symptoms:

1. Suggest possible conditions.
2. Assign urgency level:
   - Low
   - Medium
   - High
3. Provide medical recommendation.
4. Provide 5 self-care tips.

IMPORTANT:
This is not a diagnosis.

Return ONLY valid JSON.

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

        return {
            "possible_conditions": [],
            "urgency": "Service Busy",
            "recommendation": "Our AI analysis service is currently experiencing high demand. Please try again shortly.",
            "self_care": [
                "Stay hydrated",
                "Monitor your symptoms",
                "Seek medical attention if symptoms worsen"
            ]
        }