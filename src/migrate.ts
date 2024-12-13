import dotenv from 'dotenv';
import connectDB from './config/db.config';
import mongoose from 'mongoose';
import usersMigrate from './migrations/users.migrate';
import issuesMigrate from './migrations/issues.migrate';
import projectsMigrate from './migrations/projects.migrate';

(async () => {
  try {
    dotenv.config();
    await connectDB();
    await usersMigrate();
    await projectsMigrate();
    await issuesMigrate();
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
})();
