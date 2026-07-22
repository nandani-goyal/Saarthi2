require('dotenv').config();
const express = require("express");
const cors = require("cors");


const calculateMatches = require("./recommendationEngine");

const app = express();
app.use(express.json());
app.use(cors());

// const schemes = require("./schemes.json"); // removed – data now fetched from government API

function isEligible(user, scheme) {
  const e = scheme.eligibility;

  if (e.age_min && user.age < e.age_min) return false;
  if (e.age_max && user.age > e.age_max) return false;

  if (e.pregnant && !user.pregnant) return false;

  if (e.state && user.state !== e.state) return false;

   if (e.breastfeeding && !user.breastfeeding) return false;
  // hasHealthInsurance
   if (e.hasHealthInsurance && !user.hasHealthInsurance) return false;

  return true;
}
function calculateScore(user, scheme) {
  let matched = 0;
  let total = 0;

  const eligibility = scheme.eligibility;

  for (const key in eligibility) {
    total++;

    if (user[key] === eligibility[key]) {
      matched++;
    }
  }

  return Math.round((matched / total) * 100);
}
app.post("/get-schemes", async (req, res) => {
  const userData = req.body;
  try {
    const { fetchSchemes } = require("./services/schemeService");
    const schemes = await fetchSchemes();
    const scoredSchemes = schemes
      .map((scheme) => ({
        ...scheme,
        score: calculateScore(userData, scheme)
      }))
      .sort((a, b) => b.score - a.score);
    res.json({ schemes: scoredSchemes });
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(503).json({ error: "Unable to retrieve schemes at this time." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

app.post("/recommend", async (req, res) => {
  try {
    const recommendations = await calculateMatches(req.body);
    res.json(recommendations);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(503).json({ error: "Recommendation service unavailable." });
  }
});

