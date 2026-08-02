import { Schema, model, Document as MongooseDocument } from 'mongoose';

export interface IMedicine {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

export interface IPrescription extends MongooseDocument {
  doctorName: string;
  specialization?: string;
  date: string;
  status: 'Active' | 'Completed';
  medicines: IMedicine[];
  rawOcrText?: string;
  documentId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  dosage: { type: String, default: '' },
  frequency: { type: String, default: '' },
  duration: { type: String, default: '' },
});

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctorName: { type: String, required: true, default: 'Extracted Prescription' },
    specialization: { type: String, default: 'General Medicine' },
    date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
    medicines: [MedicineSchema],
    rawOcrText: { type: String, default: '' },
    documentId: { type: Schema.Types.ObjectId, ref: 'MedicalDocument' },
  },
  { timestamps: true }
);

export const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);
