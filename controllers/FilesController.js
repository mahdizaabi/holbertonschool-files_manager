import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import FileModel from '../models/fileModel';
import localStorage from '../utils/localStorage';

class FilesController {
  static async postUpload(req, res) {
    /* hecking Authentication */
    const { type, parentId } = req.body;
    console.log(parentId);
    console.log(type);

    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /* End checking authentiction */

    const user = DBClient.getUserById(userId);
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    /* check if parentId is a file with type=folder and exist
        {decoupled from the FILEMODEL class for asynchronosity isssues} */
    /* it was impossible to check this condition asynchornously
        because the setter can't wait for the asynchronous checking-operation */
    let fileToCheck;
    if (parentId) {
      try {
        fileToCheck = await FileModel.checkParentId(parentId);
        if (!fileToCheck) {
          throw new Error('Parent not found');
        }
        if (fileToCheck && fileToCheck.type !== 'folder') {
          throw new Error('Parent is not a folder');
        }
      } catch (e) {
        res.status(400).send({ error: e.message });
        return;
      }
    }
    /* END of asynchronous checking operation   */
    /*  create fileSchema from model   */
    let fileModelInstance;
    try {
      fileModelInstance = new FileModel({ ...req.body, userId });
    } catch (e) {
      res.status(400).send({ error: e.message });
      return;
    }

    /*  Save data locally */
    let localPath;
    if (type !== 'folder' && parentId === 0) {
      localPath = localStorage(req.body.data);
    }

    /* -save to database */
    const newfile = await fileModelInstance.addOneToDatabase(localPath);
    const { _id } = newfile;
    delete newfile._id;

    res.status(201).send(JSON.stringify({ ...newfile, id: _id }));
  }
}

export default FilesController;
