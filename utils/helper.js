import { pbkdf2Sync } from 'crypto';

export const formatResponseOutput = (response) => {
  const { _id } = response;
  delete response._id;
  return ({ ...response, id: _id });
};

export const hashPswd = (pwd) => pbkdf2Sync(pwd, 'salt', 100000, 64, 'sha1');
