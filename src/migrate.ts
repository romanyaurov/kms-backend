import dotenv from 'dotenv';
import connectDB from './config/db.config';
import mongoose from 'mongoose';
import usersMigrate from './migrations/users.migrate';
import issuesMigrate from './migrations/issues.migrate';

// (async () => {
//   try {
//     dotenv.config();
//     await connectDB();
//     await usersMigrate();
//     await issuesMigrate();
//   } catch (error) {
//     console.error('Migration error:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('MongoDB connection closed.');
//   }
// })();

const migration = async () => {
  try {
    dotenv.config();
    await connectDB();
    await usersMigrate();
    await issuesMigrate();
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

export default migration;
