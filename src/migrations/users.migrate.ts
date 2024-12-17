import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';

const usersMigrate = async () => {
  const filePath = path.join(__dirname, '..', 'data', 'users.json');

  const fileData = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(fileData);

  if (!Array.isArray(users)) {
    throw new Error('Invalid data format in users.json. Expacted an array.');
  }

  await UserModel.deleteMany({});
  console.log('Existing users cleared.');

  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  const result = await UserModel.insertMany(users);
  console.log(`Migrated ${result.length} users to MongoDB`);
};

export default usersMigrate;
