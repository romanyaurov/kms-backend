import { setupTestDB, seedTestDB } from './setup';

export default async () => {
  await setupTestDB();
  await seedTestDB();
};
