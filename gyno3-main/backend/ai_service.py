import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def generate_consultation_summary(symptoms: str) -> dict:
    """
    Takes user symptoms (English or Hindi), translates if necessary, 
    and returns a structured medical summary.
    Returns a dict with 'status' and 'summary'.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_key_here":
        print("Warning: Gemini API Key is missing. Falling back to 'Failed' status.")
        return {"status": "Failed", "summary": "AI processing unavailable due to missing API key."}

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        You are a medical AI assistant for a gynecology platform.
        The user has provided the following symptoms. The text might be in Hindi or English.
        
        Symptoms:
        "{symptoms}"
        
        Please do the following:
        1. If the text is in Hindi or mixed, translate it to clear English.
        2. Provide a brief, structured medical summary of the symptoms for the doctor.
        3. Do NOT provide a diagnosis. Just summarize the symptoms professionally.
        
        Output format:
        [Translation (if applicable)]
        [Structured Summary]
        """
        
        response = await model.generate_content_async(prompt)
        
        return {
            "status": "Completed",
            "summary": response.text.strip()
        }
    except Exception as e:
        print(f"Error generating AI summary: {e}")
        return {
            "status": "Failed", 
            "summary": "AI processing failed due to an internal error."
        }
