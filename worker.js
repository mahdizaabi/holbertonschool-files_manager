import Bull from 'bull';
import DBClient from './utils/db';
import { generateThump } from './utils/helper';

const imageThumbnailsQueue = new Bull('imageThumbnailsQueue');

imageThumbnailsQueue.process(async (job) => {
  const { userId, fileId } = job.data;
  if (!userId) throw new Error('Missing userId');
  if (!fileId) throw new Error('Missing fileId');

  const document = await DBClient.getFile(fileId, userId);
  if (!document) throw new Error('File not found');
  const widths = [100, 250, 500];

  widths.map((width) => ({ width, responseType: 'base64' }))
    .forEach((option) => generateThump(option, document.localPath));
});
