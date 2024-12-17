const generateUserAvatarString = (firstName: string, lastName: string): string => {
  return [firstName, lastName].join('_').toLowerCase() + '.jpg';
};

export default generateUserAvatarString;
