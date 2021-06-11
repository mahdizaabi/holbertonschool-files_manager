import { pbkdf2Sync } from 'crypto';
import { existsSync } from 'fs';

const fs = require('fs');

const mime = require('mime-types');
const imageThumbnail = require('image-thumbnail');

export const formatResponseOutput = (response) => {
  const { _id } = response;
  delete response._id;
  return ({ ...response, id: _id });
};

export const hashPswd = (pwd) => pbkdf2Sync(pwd, 'salt', 100000, 64, 'sha1');
export const checkPathExist = (path) => existsSync(path);
export const checkMimeType = (file) => mime.lookup(file);

export const generateThump = async (options, path) => {
  let thumbnail;

  try {
    /* decode from Base64 to PNG */

    const r = fs.readFileSync(path, 'utf-8');
    thumbnail = await imageThumbnail(r, options);
    const thumbNailPath = path.split('/').pop();

    fs.writeFileSync(`/tmp/files_manager/${thumbNailPath}_${options.width}`, thumbnail, { encoding: 'base64' }, (err) => {
      if (err) {
        console.log(err.message);
        return ({ error: err });
      }
      console.log('succefully written to disk');
      return ({ s: 's' });
    });
  } catch (err) {
    console.log('xsssssssssssssssssssssscccccc');

    console.error(err);
  }
  return thumbnail;
};
