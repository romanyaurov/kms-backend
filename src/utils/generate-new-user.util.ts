import { addUserDataType } from '../services/user.service';

const generateNewUser = (userData: addUserDataType) => {
  const avatar =
    [userData.firstName, userData.lastName].join('_').toLowerCase() + '.jpg';
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  return {
    ...userData,
    avatar,
    createdAt,
    updatedAt,
  };
};

export default generateNewUser;
