import mongoose from 'mongoose';
import usersMigrate from '../src/migrations/users.migrate';
import projectsMigrate from '../src/migrations/projects.migrate';
import issuesMigrate from '../src/migrations/issues.migrate';

export const setupTestDB = async () => {
  const uri = 'mongodb://localhost:27017/kaban-test';
  await mongoose.connect(uri);
};

export const seedTestDB = async () => {
  await usersMigrate();
  await projectsMigrate();
  await issuesMigrate();
};

export const teardownTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
