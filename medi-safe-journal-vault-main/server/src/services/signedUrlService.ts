import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SIGNED_URL_SECRET = process.env.SIGNED_URL_SECRET || 'saarthi_signed_url_hmac_secret_key_2026!';
const DEFAULT_TTL_SECONDS = parseInt(process.env.URL_TTL_SECONDS || '900', 10); // 15 minutes default

export interface SignedTokenPayload {
  documentId: string;
  expiresAt: number; // UNIX timestamp in ms
  signature: string;
}

/**
 * Generates an expiring HMAC-SHA256 signed access token for a document.
 */
export const generateSignedToken = (documentId: string, ttlSeconds: number = DEFAULT_TTL_SECONDS): { token: string; expiresAt: number } => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const payloadToSign = `${documentId}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', SIGNED_URL_SECRET)
    .update(payloadToSign)
    .digest('hex');

  const tokenPayload = `${documentId}.${expiresAt}.${signature}`;
  const token = Buffer.from(tokenPayload).toString('base64url');

  return { token, expiresAt };
};

/**
 * Verifies an incoming expiring signed token.
 * Returns the documentId if valid and unexpired; throws an Error otherwise.
 */
export const verifySignedToken = (token: string): string => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [documentId, expiresAtStr, signature] = decoded.split('.');

    if (!documentId || !expiresAtStr || !signature) {
      throw new Error('Malformed token format');
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      throw new Error('Access link has expired');
    }

    const payloadToSign = `${documentId}:${expiresAt}`;
    const expectedSignature = crypto
      .createHmac('sha256', SIGNED_URL_SECRET)
      .update(payloadToSign)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) === false) {
      throw new Error('Invalid token signature');
    }

    return documentId;
  } catch (err: any) {
    throw new Error(`Forbidden: ${err.message || 'Invalid or expired access URL'}`);
  }
};
