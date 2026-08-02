import { Schema, model, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  originalName: string;
  mimeType: string;
  size: number;
  encryptedData: string; // Base64 encoded encrypted buffer
  iv: string;            // Base64 or Hex encoded AES Initialization Vector
  authTag: string;       // Base64 or Hex encoded AES-GCM Auth Tag
  category: 'prescription' | 'scan' | 'lab_report';
  fileHash: string;      // SHA-256 hash of original file buffer
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    encryptedData: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['prescription', 'scan', 'lab_report'], 
      required: true,
      default: 'prescription'
    },
    fileHash: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const MedicalDocument = model<IDocument>('MedicalDocument', DocumentSchema);
