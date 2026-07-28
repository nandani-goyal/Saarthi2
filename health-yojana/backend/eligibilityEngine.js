/**
 * eligibilityEngine.js
 *
 * Pure functions for determining scheme eligibility and scoring.
 * Extracted from server.js so they can be unit-tested independently.
 *
 * Think of this like a "rule book" – it knows nothing about HTTP,
 * databases, or React. It just takes data in and returns a result.
 */

/**
 * isEligible – hard gate check.
 * Returns false as soon as ANY eligibility rule fails.
 *
 * How to read each check:
 *   - "e.age_min" means "the scheme has a minimum age requirement"
 *   - If the scheme has the requirement AND the user doesn't meet it → not eligible
 *
 * @param {object} user   - The form data from the user
 * @param {object} scheme - A single scheme object from schemes.json
 * @returns {boolean}
 */
function isEligible(user, scheme) {
  const e = scheme.eligibility;

  // Age range checks
  if (e.age_min && user.age < e.age_min) return false;
  if (e.age_max && user.age > e.age_max) return false;

  // Pregnancy check
  if (e.pregnant && !user.pregnant) return false;

  // State-specific check
  if (e.state && user.state !== e.state) return false;

  // Breastfeeding check
  if (e.breastfeeding && !user.breastfeeding) return false;

  // Health insurance check
  if (e.hasHealthInsurance && !user.hasHealthInsurance) return false;

  return true;
}

/**
 * calculateScore – relevance score (0–100).
 * Counts how many eligibility fields the user EXACTLY matches.
 *
 * Example:
 *   scheme.eligibility = { pregnant: true, state: "rajasthan" }
 *   user = { pregnant: true, state: "gujarat" }
 *   → 1 out of 2 match → score = 50
 *
 * @param {object} user   - The form data from the user
 * @param {object} scheme - A single scheme object from schemes.json
 * @returns {number}      - Integer between 0 and 100
 */
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

  // Prevent division by zero for schemes with no eligibility rules
  if (total === 0) return 100;

  return Math.round((matched / total) * 100);
}

module.exports = { isEligible, calculateScore };
