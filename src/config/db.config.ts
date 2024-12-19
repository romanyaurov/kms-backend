import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  try {
    await mongoose.connect(uri as string);
    console.log(`MongoDB connected to "${uri?.split('/').at(-1)}"`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
