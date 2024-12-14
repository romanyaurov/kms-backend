import mongoose from 'mongoose';

const connectDB = async () => {
  const dbURI =
    process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost:27017/kaban-test'
      : process.env.MONGO_URL;

  try {
    await mongoose.connect(dbURI as string);
    console.log(`MongoDB connected to "${dbURI?.split('/').at(-1)}"`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
