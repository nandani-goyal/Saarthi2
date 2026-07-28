/**
 * eligibility.test.js
 *
 * Unit tests for isEligible() and calculateScore().
 *
 * As a junior dev, think of unit tests like this:
 *   - You write small, focused "examples" that prove a function works correctly.
 *   - If someone accidentally breaks the function later, the test will catch it.
 *   - Each `test(...)` call is one scenario.
 *
 * Run with: npm test (from the backend folder)
 */

const { isEligible, calculateScore } = require("../eligibilityEngine");

// ---------------------------------------------------------------------------
// Sample schemes – we define a few fake schemes for testing purposes so we
// don't depend on the real schemes.json file
// ---------------------------------------------------------------------------
const pregnantMpScheme = {
  name: "Test Maternity Scheme",
  eligibility: {
    pregnant: true,
    state: "madhya_pradesh",
    age_min: 18,
  },
};

const breastfeedingScheme = {
  name: "Test Breastfeeding Scheme",
  eligibility: {
    breastfeeding: true,
    age_min: 19,
  },
};

const openScheme = {
  name: "Women Health Card",
  eligibility: {
    gender: "female",
  },
};

// ---------------------------------------------------------------------------
// isEligible() tests
// ---------------------------------------------------------------------------
describe("isEligible()", () => {
  test("returns true when user meets all eligibility criteria", () => {
    const user = { age: 25, state: "madhya_pradesh", pregnant: true };
    expect(isEligible(user, pregnantMpScheme)).toBe(true);
  });

  test("returns false when user is not pregnant but scheme requires it", () => {
    const user = { age: 25, state: "madhya_pradesh", pregnant: false };
    expect(isEligible(user, pregnantMpScheme)).toBe(false);
  });

  test("returns false when user is from wrong state", () => {
    const user = { age: 25, state: "gujarat", pregnant: true };
    expect(isEligible(user, pregnantMpScheme)).toBe(false);
  });

  test("returns false when user is below minimum age", () => {
    const user = { age: 16, state: "madhya_pradesh", pregnant: true };
    expect(isEligible(user, pregnantMpScheme)).toBe(false);
  });

  test("returns true for breastfeeding scheme when user is breastfeeding and old enough", () => {
    const user = { age: 22, breastfeeding: true };
    expect(isEligible(user, breastfeedingScheme)).toBe(true);
  });

  test("returns false for breastfeeding scheme when user is not breastfeeding", () => {
    const user = { age: 22, breastfeeding: false };
    expect(isEligible(user, breastfeedingScheme)).toBe(false);
  });

  test("returns true for open scheme (no state/pregnancy restrictions)", () => {
    const user = { age: 30, state: "rajasthan" };
    // openScheme only requires gender: 'female' — which isn't checked in isEligible currently
    // so it should pass all gate checks
    expect(isEligible(user, openScheme)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// calculateScore() tests
// ---------------------------------------------------------------------------
describe("calculateScore()", () => {
  test("returns 100 when user exactly matches all eligibility fields", () => {
    const user = { pregnant: true, state: "madhya_pradesh", age: 25, age_min: 18 };
    const scheme = {
      eligibility: { pregnant: true, state: "madhya_pradesh" },
    };
    // 2 fields, both match → 100%
    expect(calculateScore(user, scheme)).toBe(100);
  });

  test("returns 50 when user matches half the eligibility fields", () => {
    const user = { pregnant: true, state: "gujarat" }; // state doesn't match
    const scheme = {
      eligibility: { pregnant: true, state: "madhya_pradesh" },
    };
    // 2 fields, 1 match → 50%
    expect(calculateScore(user, scheme)).toBe(50);
  });

  test("returns 0 when user matches no eligibility fields", () => {
    const user = { pregnant: false, state: "gujarat" };
    const scheme = {
      eligibility: { pregnant: true, state: "madhya_pradesh" },
    };
    // 2 fields, 0 match → 0%
    expect(calculateScore(user, scheme)).toBe(0);
  });

  test("returns 100 for a scheme with no eligibility rules (default safe)", () => {
    const user = { age: 30 };
    const scheme = { eligibility: {} };
    // 0 total fields → should not divide by zero → returns 100
    expect(calculateScore(user, scheme)).toBe(100);
  });
});
