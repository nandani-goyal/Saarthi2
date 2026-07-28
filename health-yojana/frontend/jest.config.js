/**
 * jest.config.js – Frontend Jest configuration
 *
 * Key settings explained for a junior dev:
 *
 * preset: "ts-jest"         → Tells Jest to use ts-jest to compile TypeScript files.
 *                             Without this, Jest can't understand .ts or .tsx files.
 *
 * testEnvironment: "jsdom"  → Simulates a browser environment (window, document, etc.)
 *                             React components need a DOM to render into.
 *
 * moduleNameMapper          → Vite uses "@/" as a shorthand for "./src/". Jest doesn't
 *                             know this, so we teach it here by mapping "@/" → "<rootDir>/src/".
 *
 * setupFilesAfterFramework  → Runs @testing-library/jest-dom which adds custom matchers
 *                             like toBeInTheDocument(), toHaveClass(), etc.
 */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  // Map Vite's "@/" path alias so imports like "@/lib/schemeService" work in tests
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle CSS imports (they're not needed in tests but shouldn't crash)
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/fileMock.js",
  },

  // File extensions Jest will look at
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Automatically import jest-dom matchers into every test file
  setupFilesAfterFramework: ["@testing-library/jest-dom"],

  // Where to find tests
  testMatch: ["<rootDir>/src/__tests__/**/*.test.{ts,tsx}"],

  // TypeScript config for ts-jest
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
      },
    },
  },
};
