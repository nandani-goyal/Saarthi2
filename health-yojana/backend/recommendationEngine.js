const schemes = require("./schemes.json");

function calculateMatches(user) {
  const results = [];

  schemes.forEach((scheme) => {
    let score = 0;
    let reasons = [];

    const eligibility = scheme.eligibility;

    // Gender
    if (eligibility.gender) {
      if (user.gender === eligibility.gender) {
        score += 5;
        reasons.push("Gender matched");
      }
    }

    // State
    if (eligibility.state) {
      if (user.state === eligibility.state) {
        score += 30;
        reasons.push("State matched");
      }
    }

    // Pregnancy
    if (eligibility.pregnant !== undefined) {
      if (user.pregnant === eligibility.pregnant) {
        score += 25;
        reasons.push("Pregnancy status matched");
      }
    }

    // Breastfeeding
    if (eligibility.breastfeeding !== undefined) {
      if (
        user.breastfeeding ===
        eligibility.breastfeeding
      ) {
        score += 20;
        reasons.push("Breastfeeding status matched");
      }
    }

    // Health Insurance
    if (eligibility.hasHealthInsurance !== undefined) {
      if (
        user.hasHealthInsurance ===
        eligibility.hasHealthInsurance
      ) {
        score += 15;
        reasons.push("Insurance criteria matched");
      }
    }

    // Age
    if (eligibility.age_min) {
      if (user.age >= eligibility.age_min) {
        score += 5;
        reasons.push("Age criteria matched");
      }
    }

    if (score > 0) {
      results.push({
        ...scheme,
        matchScore: score,
        reasons
      });
    }
  });

  results.sort(
    (a, b) => b.matchScore - a.matchScore
  );

  return results;
}

module.exports = calculateMatches;