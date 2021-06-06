import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import FileModel from '../models/fileModel';
import localStorage from '../utils/localStorage';
import paginateResults from '../utils/pagination';

class FilesController {
  static async postUpload(req, res) {
    /* hecking Authentication */
    const { type, parentId } = req.body;

    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /* End checking authentiction */

    const user = await DBClient.getUserById(userId);
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
      fileModelInstance = new FileModel({ ...req.body, userId, parentId });
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

  static async getShow(req, res) {
    /* hecking Authentication (to be replaces with middleware afterwards) */
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /* End checking authentiction */
    const user = await DBClient.getUserById(userId);
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const { id } = req.params;
    const file = await DBClient.getFile(id, userId);
    if (!file) {
      res.status(404).send('Not found');
    }
    res.status(201).send(JSON.stringify(file));
  }

  static async getIndex(req, res) {
    /*  parse Query parameters(URL string) and Get parentId */
    let { parentId } = req.query;
    const { page } = req.query;
    /* no-unused-expressions */
    if (typeof parentId === 'undefined') {
      parentId = 0;
    }
    /* START AUTHENTICATION    */
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /* End checking authentiction */
    const user = await DBClient.getUserById(userId);
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /*  get all files for the authenticated user  */
    const allFiles = await DBClient.getAllFilesBasedParentId(userId, parentId);

    if (await allFiles.count() === 0) {
      res.status(201).send(JSON.stringify([]));
      return;
    }

    paginateResults(allFiles, page, res);
  }
}

export default FilesController;
