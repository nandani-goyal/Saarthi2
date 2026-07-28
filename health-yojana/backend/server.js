require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { z } = require("zod");

const calculateMatches = require("./recommendationEngine");
const { isEligible, calculateScore } = require("./eligibilityEngine");

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------------------------------------------------------
// Zod Schema – defines exactly what the /get-schemes body must look like.
//
// Think of this as a "bouncer at the door": before your eligibility logic
// runs, every incoming request is checked against these rules.
// If anything is wrong, we return a clear 400 error instead of crashing.
// ---------------------------------------------------------------------------
const userSchema = z.object({
  age: z
    .number({ required_error: "age is required", invalid_type_error: "age must be a number" })
    .int("age must be a whole number")
    .min(0, "age must be 0 or greater")
    .max(120, "age must be 120 or less"),

  state: z
    .string({ required_error: "state is required" })
    .min(1, "state cannot be empty"),

  pregnant: z
    .boolean({ invalid_type_error: "pregnant must be true or false" })
    .optional()
    .default(false),

  breastfeeding: z
    .boolean({ invalid_type_error: "breastfeeding must be true or false" })
    .optional()
    .default(false),

  hasHealthInsurance: z
    .boolean({ invalid_type_error: "hasHealthInsurance must be true or false" })
    .optional()
    .default(false),

  // Optional fields – present in form but not required for eligibility
  name: z.string().optional(),
  income: z.string().optional(),
  familySize: z.string().optional(),
  district: z.string().optional(),
});

// Export the schema so tests can import it directly
module.exports.userSchema = userSchema;

// ---------------------------------------------------------------------------
// POST /get-schemes
// ---------------------------------------------------------------------------
app.post("/get-schemes", async (req, res) => {
  // 1. Validate the incoming body
  const parseResult = userSchema.safeParse(req.body);

  if (!parseResult.success) {
    // safeParse gives us a structured error – flatten it into readable messages
    const errors = parseResult.error.flatten().fieldErrors;
    return res.status(400).json({
      error: "Invalid request data. Please check the fields below.",
      details: errors,
    });
  }

  // 2. Use the validated (and type-coerced) data from here on
  const userData = parseResult.data;

  try {
    const { fetchSchemes } = require("./services/schemeService");
    const schemes = await fetchSchemes();

    const scoredSchemes = schemes
      .map((scheme) => ({
        ...scheme,
        score: calculateScore(userData, scheme),
      }))
      .sort((a, b) => b.score - a.score);

    res.json({ schemes: scoredSchemes });
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(503).json({ error: "Unable to retrieve schemes at this time." });
  }
});

// Only start the HTTP server when this file is run directly (node server.js)
// When imported by tests, we don't want to actually bind to a port
if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

app.post("/recommend", async (req, res) => {
  try {
    const recommendations = await calculateMatches(req.body);
    res.json(recommendations);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(503).json({ error: "Recommendation service unavailable." });
  }
});
