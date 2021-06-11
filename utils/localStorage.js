import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');

const localStorage = (data) => {
  const folder = process.env.FOLDER_PATH || '/tmp/files_manager';
  const storagePath = `${folder}/${uuidv4()}`;
  const clearData = Buffer.from(data, 'base64').toString('base64');

  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  } catch (err) {
    console.error(err);
  }

  fs.writeFile(storagePath, clearData, (err) => {
    if (err) {
      return ({ error: err });
    }
    return ({ s: 's' });
  });
  return (storagePath);
};
export default localStorage;
