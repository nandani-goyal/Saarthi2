/**
 * schemeService.test.ts
 *
 * Unit tests for the frontend schemeService (getEligibleSchemes).
 *
 * What we're testing here:
 *   - Does getEligibleSchemes make a POST request to the right URL?
 *   - Does it correctly return the `schemes` array from the response?
 *   - Does it throw an error if the server is unreachable?
 *
 * We use "fetch mocking" to pretend the server exists during tests,
 * so we don't actually need the backend to be running.
 */

// Mock the global fetch before importing anything
// (Jest replaces the real fetch with a fake that we control)
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { getEligibleSchemes } from "../lib/schemeService";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------
const sampleUser = {
  age: 25,
  state: "madhya_pradesh",
  pregnant: true,
  breastfeeding: false,
  hasHealthInsurance: false,
};

const sampleSchemes = [
  { name: "Test Maternity Scheme", benefits: ["₹4,000"], score: 100 },
  { name: "Test National Scheme", benefits: ["₹2,000"], score: 66 },
];

// ---------------------------------------------------------------------------
// Reset the mock between tests so they don't interfere
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockFetch.mockReset();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("getEligibleSchemes()", () => {
  test("sends a POST request to the correct endpoint", async () => {
    // Set up the mock to return a successful response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ schemes: sampleSchemes }),
    });

    await getEligibleSchemes(sampleUser);

    // Check that fetch was called exactly once
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Check the URL and method
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:3000/get-schemes");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  test("sends the correct user data in the request body", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ schemes: sampleSchemes }),
    });

    await getEligibleSchemes(sampleUser);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.age).toBe(25);
    expect(body.state).toBe("madhya_pradesh");
    expect(body.pregnant).toBe(true);
  });

  test("returns the schemes array from the response", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ schemes: sampleSchemes }),
    });

    const result = await getEligibleSchemes(sampleUser);

    // The function should return exactly the schemes array (unwrapped from { schemes: [...] })
    expect(result).toEqual(sampleSchemes);
    expect(result).toHaveLength(2);
  });

  test("returns an empty array when the server returns zero schemes", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ schemes: [] }),
    });

    const result = await getEligibleSchemes(sampleUser);
    expect(result).toEqual([]);
  });

  test("throws an error when fetch fails (network error)", async () => {
    // Simulate the backend being unreachable
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await expect(getEligibleSchemes(sampleUser)).rejects.toThrow("Failed to fetch");
  });
});
