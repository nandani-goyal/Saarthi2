import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saarthi-auth';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[MongoDB] Connected successfully to shared database: ${MONGODB_URI}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};
