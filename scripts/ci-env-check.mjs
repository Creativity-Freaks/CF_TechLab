#!/usr/bin/env node
// Simple pre-build sanity check for required env vars.
const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('[env-check] Missing required env vars:', missing.join(', '));
  process.exit(1);
}
console.log('[env-check] All required env vars present.');
