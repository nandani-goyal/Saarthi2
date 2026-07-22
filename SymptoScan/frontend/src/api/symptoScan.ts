const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getDiagnosis = async (symptoms: string[]) => {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms }),
  });

  if (!response.ok) throw new Error("API call failed");
  return response.json();
};

export const analyzeSymptoms = async (symptoms: string[]) => {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms }),
  });

  if (!response.ok) throw new Error("API call failed");
  return response.json();
};

export const getTips = async () => {
  const res = await fetch(`${API_BASE}/get-tips`);
  if (!res.ok) throw new Error("Failed to fetch tips");
  return await res.json();
};

