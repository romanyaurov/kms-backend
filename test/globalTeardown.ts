import { teardownTestDB } from './setup';

export default async () => {
  await teardownTestDB();
};
