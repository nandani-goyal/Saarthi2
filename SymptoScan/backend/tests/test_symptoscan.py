import unittest
from app.symptoscan import predict_condition, SymptomRequest

class TestSymptoScanRulesEngine(unittest.TestCase):

    def test_empty_symptoms(self):
        # Test case: No symptoms provided
        request = SymptomRequest(symptoms=[])
        result = predict_condition(request)
        self.assertEqual(result["predicted_condition"], "Condition not confidently detected")
        self.assertEqual(result["confidence"], 0.0)

    def test_exact_match(self):
        # Test case: Exact matching of PCOS symptoms (all 5)
        request = SymptomRequest(symptoms=["irregular periods", "acne", "weight gain", "facial hair", "hair thinning"])
        result = predict_condition(request)
        self.assertEqual(result["predicted_condition"], "PCOD/PCOS")
        self.assertEqual(result["confidence"], 1.0)

    def test_case_insensitivity(self):
        # Test case: Symptoms with mixed case and whitespace
        request_clean = SymptomRequest(symptoms=["ACNE", "Irregular Periods"])
        result_clean = predict_condition(request_clean)
        self.assertEqual(result_clean["predicted_condition"], "PCOD/PCOS")
        # PCOS has 5 symptoms. 2 matches = 2 / 5 = 0.40 confidence.
        self.assertEqual(result_clean["confidence"], 0.4)

    def test_unknown_symptoms(self):
        # Test case: Symptoms that do not match any known conditions
        request = SymptomRequest(symptoms=["headache", "sneezing", "sore throat"])
        result = predict_condition(request)
        self.assertEqual(result["predicted_condition"], "Condition not confidently detected")
        self.assertEqual(result["confidence"], 0.0)

    def test_partial_match(self):
        # Test case: Partial match with Dysmenorrhea (cramps, painful periods, nausea, back pain)
        request = SymptomRequest(symptoms=["cramps", "back pain"])
        result = predict_condition(request)
        self.assertEqual(result["predicted_condition"], "Dysmenorrhea")
        # Dysmenorrhea has 4 symptoms. 2 matches = 2 / 4 = 0.50 confidence.
        self.assertEqual(result["confidence"], 0.5)

if __name__ == "__main__":
    unittest.main()
