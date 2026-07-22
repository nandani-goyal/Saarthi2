// backend/services/schemeService.js

/**
 * Service that provides the list of health schemes.
 *
 * The original implementation fetched data from a government REST API.
 * The user now wants the project to rely **solely** on the static JSON
 * file `backend/schemes.json` that already exists in the repository.
 *
 * This module therefore reads that file, caches the result in memory, and
 * returns the array of scheme objects.  The public function `fetchSchemes`
 * retains the same signature as before, so no other part of the codebase
 * (recommendationEngine, server routes, frontend) needs to be touched.
 */

require('dotenv').config(); // keep for consistency; not used here

const fs = require('fs').promises;
const path = require('path');
const NodeCache = require('node-cache');

// ---------------------------------------------------------------------------
// Configuration (environment variables)
// ---------------------------------------------------------------------------
const CACHE_TTL_SECONDS = process.env.GOV_SCHEMES_CACHE_TTL
  ? parseInt(process.env.GOV_SCHEMES_CACHE_TTL, 10)
  : 12 * 60 * 60; // default 12 h

// In‑memory cache – stores the final scheme list.
const cache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS, checkperiod: CACHE_TTL_SECONDS / 2 });

// ---------------------------------------------------------------------------
// Helper: read the static JSON file bundled with the repo
// ---------------------------------------------------------------------------
async function getStaticSchemes() {
  const staticPath = path.resolve(__dirname, '..', 'schemes.json');
  const raw = await fs.readFile(staticPath, 'utf-8');
  // The file already follows the internal Scheme shape, so we can return it directly.
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Public API – returns cached data or loads it from the static file
// ---------------------------------------------------------------------------
async function fetchSchemes() {
  const cached = cache.get('schemes');
  if (cached) return cached;

  const schemes = await getStaticSchemes();
  cache.set('schemes', schemes);
  return schemes;
}

module.exports = { fetchSchemes };
