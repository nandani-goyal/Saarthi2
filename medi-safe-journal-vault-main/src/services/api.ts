const API_BASE = '/api';

export interface Medicine {
  _id?: string;
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

export interface PrescriptionRecord {
  _id: string;
  doctorName: string;
  specialization?: string;
  date: string;
  status: 'Active' | 'Completed';
  medicines: Medicine[];
  rawOcrText?: string;
  documentId?: string;
  createdAt: string;
}

export interface MedicalScanRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface SignedUrlResponse {
  documentId: string;
  signedUrl: string;
  expiresAt: string;
  ttlSeconds: number;
  securityNote: string;
}

/**
 * Uploads a prescription file, triggering AES-256 encryption at rest and Tesseract.js OCR auto-extraction.
 */
export async function uploadPrescription(file: File): Promise<{ prescription: PrescriptionRecord; documentId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/prescriptions/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload prescription');
  }

  return response.json();
}

/**
 * Uploads a medical scan / X-ray file with server-side AES-256 encryption.
 */
export async function uploadMedicalScan(file: File): Promise<{ document: MedicalScanRecord }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/scans/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload scan');
  }

  return response.json();
}

/**
 * Fetches all prescriptions stored in MongoDB.
 */
export async function fetchPrescriptions(): Promise<PrescriptionRecord[]> {
  const response = await fetch(`${API_BASE}/prescriptions`);
  if (!response.ok) {
    throw new Error('Failed to fetch prescriptions from database');
  }
  return response.json();
}

/**
 * Fetches all medical scans stored in MongoDB.
 */
export async function fetchMedicalScans(): Promise<MedicalScanRecord[]> {
  const response = await fetch(`${API_BASE}/scans`);
  if (!response.ok) {
    throw new Error('Failed to fetch medical scans');
  }
  return response.json();
}

/**
 * Requests an expiring HMAC-SHA256 signed access URL to view an encrypted file securely.
 */
export async function getSignedDocumentUrl(documentId: string): Promise<SignedUrlResponse> {
  const response = await fetch(`${API_BASE}/documents/${documentId}/signed-url`);
  if (!response.ok) {
    throw new Error('Failed to request signed document URL');
  }
  return response.json();
}
