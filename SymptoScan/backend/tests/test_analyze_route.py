import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app

class TestAnalyzeRoute(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_empty_symptoms_returns_error(self):
        response = self.client.post("/analyze", json={
            "symptoms": [],
            "duration": "2-7 days",
            "severity": "moderate",
            "language": "English"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Please provide at least one symptom.")

    def test_emergency_override_bypass_english(self):
        # "chest pain" is a red-flag symptom
        response = self.client.post("/analyze", json={
            "symptoms": ["chest pain", "fatigue"],
            "duration": "under 24h",
            "severity": "severe",
            "language": "English"
        })
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["urgency"], "Emergency")
        self.assertIn("EMERGENCY", json_data["recommendation"])
        self.assertIn("Do not wait for self-care remedies.", json_data["self_care"])

    def test_emergency_override_bypass_hindi(self):
        # "severe bleeding" is a red-flag symptom
        response = self.client.post("/analyze", json={
            "symptoms": ["severe bleeding"],
            "duration": "under 24h",
            "severity": "severe",
            "language": "Hindi"
        })
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["urgency"], "Emergency")
        self.assertIn("आपातकालीन", json_data["recommendation"])
        self.assertIn("स्व-देखभाल उपचारों की प्रतीक्षा न करें।", json_data["self_care"])

    @patch("routes.symptom.analyze_symptoms")
    def test_standard_symptoms_calls_gemini_service(self, mock_analyze_symptoms):
        # Mock Gemini service response
        mock_analyze_symptoms.return_value = {
            "possible_conditions": ["PCOS"],
            "urgency": "Low",
            "recommendation": "Consult a doctor if symptoms persist.",
            "self_care": ["Stay active"]
        }

        response = self.client.post("/analyze", json={
            "symptoms": ["irregular periods", "acne"],
            "duration": "1-4 weeks",
            "severity": "mild",
            "language": "English"
        })
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["urgency"], "Low")
        self.assertEqual(json_data["possible_conditions"], ["PCOS"])
        
        # Verify that our service mock was called with correct parameters
        mock_analyze_symptoms.assert_called_once_with(
            symptoms=["irregular periods", "acne"],
            duration="1-4 weeks",
            severity="mild",
            language="English"
        )

if __name__ == "__main__":
    unittest.main()
