const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const CONSENT_TYPES_PATH = path.resolve(__dirname, '../src/types/consent.ts');
const ANALYTICS_MATCHER_PATH = path.resolve(__dirname, '../src/utils/analyticsCookieMatcher.ts');
const CONSENT_BROADCAST_PATH = path.resolve(__dirname, '../src/services/consentBroadcast.ts');

// --- 1. ConsentState interface ---
const consentTypesContent = fs.readFileSync(CONSENT_TYPES_PATH, 'utf-8');
const consentStateMatch = consentTypesContent.match(/export interface ConsentState\s*\{[^}]+\}/);
if (!consentStateMatch) {
  console.error('Could not find ConsentState interface in consent.ts');
  process.exit(1);
}

// --- 2. analyticsCookieWhitelist ---
const analyticsMatcher = fs.readFileSync(ANALYTICS_MATCHER_PATH, 'utf-8');
const whitelistMatch = analyticsMatcher.match(/export const analyticsCookieWhitelist\s*=\s*\{[\s\S]+?\};/);
if (!whitelistMatch) {
  console.error('Could not find analyticsCookieWhitelist in analyticsCookieMatcher.ts');
  process.exit(1);
}

// --- 3. DOMAIN_WHITELIST in consentBroadcast ---
const broadcastContent = fs.readFileSync(CONSENT_BROADCAST_PATH, 'utf-8');
const domainWhitelistMatch = broadcastContent.match(/const DOMAIN_WHITELIST\s*=\s*\[[\s\S]+?\];/);
if (!domainWhitelistMatch) {
  console.error('Could not find DOMAIN_WHITELIST in consentBroadcast.ts');
  process.exit(1);
}

// Concatenate all three sources and normalise whitespace
const combined = [consentStateMatch[0], whitelistMatch[0], domainWhitelistMatch[0]]
  .map((s) => s.replaceAll(/\s+/g, ' ').trim())
  .join('|');

const hash = crypto
  .createHash('sha256')
  .update(combined)
  .digest('hex')
  .slice(0, 8);

console.log(hash);
