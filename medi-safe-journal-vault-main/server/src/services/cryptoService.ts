import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY_RAW = process.env.ENCRYPTION_SECRET_KEY || 'saarthi_medivault_aes256_secret_key_32bytes!!';
// Ensure 32-byte key for AES-256 using SHA-256 hash of the secret string
const KEY = crypto.createHash('sha256').update(SECRET_KEY_RAW).digest();

export interface EncryptedResult {
  encryptedData: string; // Base64
  iv: string;            // Hex
  authTag: string;       // Hex
}

/**
 * Encrypts a raw buffer server-side using AES-256-GCM before persisting at rest.
 */
export const encryptBuffer = (buffer: Buffer): EncryptedResult => {
  const iv = crypto.randomBytes(16); // 128-bit IV for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted.toString('base64'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

/**
 * Decrypts an encrypted buffer on-the-fly when requested via a valid signed expiring token.
 */
export const decryptBuffer = (
  encryptedBase64: string,
  ivHex: string,
  authTagHex: string
): Buffer => {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted;
};
