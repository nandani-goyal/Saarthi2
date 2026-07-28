/**
 * validation.test.js
 *
 * Unit tests for the Zod userSchema defined in server.js.
 *
 * What is Zod validation testing?
 * Instead of testing the whole HTTP server, we just test the schema in isolation:
 *   - Give it valid data → it should parse successfully
 *   - Give it invalid data → it should return specific error messages
 *
 * This is fast (no network), predictable, and easy to read.
 *
 * Run with: npm test (from the backend folder)
 */

const { userSchema } = require("../server");

// ---------------------------------------------------------------------------
// Helper: run safeParse and return a clean object of field errors
// ---------------------------------------------------------------------------
function getErrors(data) {
  const result = userSchema.safeParse(data);
  if (result.success) return null;
  return result.error.flatten().fieldErrors;
}

// ---------------------------------------------------------------------------
// Valid payloads
// ---------------------------------------------------------------------------
describe("userSchema – valid payloads", () => {
  test("accepts a fully valid payload", () => {
    const result = userSchema.safeParse({
      age: 28,
      state: "madhya_pradesh",
      pregnant: true,
      breastfeeding: false,
      hasHealthInsurance: false,
    });
    expect(result.success).toBe(true);
  });

  test("accepts payload without optional fields (pregnant defaults to false)", () => {
    const result = userSchema.safeParse({
      age: 30,
      state: "rajasthan",
    });
    expect(result.success).toBe(true);
    // Zod sets defaults automatically
    expect(result.data.pregnant).toBe(false);
    expect(result.data.breastfeeding).toBe(false);
    expect(result.data.hasHealthInsurance).toBe(false);
  });

  test("accepts payload with optional fields like name and district", () => {
    const result = userSchema.safeParse({
      age: 22,
      state: "gujarat",
      name: "Priya",
      district: "Surat",
      income: "below-50k",
      familySize: "4",
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Invalid payloads
// ---------------------------------------------------------------------------
describe("userSchema – invalid payloads", () => {
  test("rejects missing age", () => {
    const errors = getErrors({ state: "rajasthan" });
    expect(errors).not.toBeNull();
    expect(errors.age).toBeDefined();
    // Zod v4 says 'expected number, received undefined' when field is missing
    expect(errors.age[0]).toMatch(/expected number/i);
  });

  test("rejects string age (age must be a number)", () => {
    const errors = getErrors({ age: "twenty-five", state: "rajasthan" });
    expect(errors).not.toBeNull();
    expect(errors.age).toBeDefined();
    expect(errors.age[0]).toMatch(/number/i);
  });

  test("rejects negative age", () => {
    const errors = getErrors({ age: -5, state: "rajasthan" });
    expect(errors).not.toBeNull();
    expect(errors.age).toBeDefined();
    expect(errors.age[0]).toMatch(/0 or greater/i);
  });

  test("rejects age above 120", () => {
    const errors = getErrors({ age: 150, state: "rajasthan" });
    expect(errors).not.toBeNull();
    expect(errors.age).toBeDefined();
    expect(errors.age[0]).toMatch(/120 or less/i);
  });

  test("rejects missing state", () => {
    const errors = getErrors({ age: 25 });
    expect(errors).not.toBeNull();
    expect(errors.state).toBeDefined();
    // Zod v4 says 'expected string, received undefined' when field is missing
    expect(errors.state[0]).toMatch(/expected string/i);
  });

  test("rejects empty string state", () => {
    const errors = getErrors({ age: 25, state: "" });
    expect(errors).not.toBeNull();
    expect(errors.state).toBeDefined();
  });

  test("rejects non-boolean pregnant value", () => {
    const errors = getErrors({ age: 25, state: "gujarat", pregnant: "yes" });
    expect(errors).not.toBeNull();
    expect(errors.pregnant).toBeDefined();
    // Zod v4 says 'expected boolean, received string'
    expect(errors.pregnant[0]).toMatch(/expected boolean/i);
  });

  test("rejects non-boolean breastfeeding value", () => {
    const errors = getErrors({ age: 25, state: "gujarat", breastfeeding: 1 });
    expect(errors).not.toBeNull();
    expect(errors.breastfeeding).toBeDefined();
  });
});
