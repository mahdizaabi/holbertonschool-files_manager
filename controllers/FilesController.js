import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import FileModel from '../models/fileModel';
import localStorage from '../utils/localStorage';
import paginateResults from '../utils/pagination';

class FilesController {
  static async postUpload(req, res) {
    /* hecking Authentication */
    const { type } = req.body;
    let { parentId } = req.body;
    if (!parentId) {
      parentId = 0;
    }
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    /* End checking authentiction */

    const user = await DBClient.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* check if parentId is a file with type=folder and exist
        {decoupled from the FILEMODEL class for asynchronosity isssues} */
    /* it was impossible to check this condition asynchornously
        because the setter can't wait for the asynchronous checking-operation */
    let fileToCheck;
    if (parentId && parentId !== 0) {
      try {
        fileToCheck = await FileModel.checkParentId(parentId);
        if (!fileToCheck) {
          throw new Error('Parent not found');
        }
        if (fileToCheck && fileToCheck.type !== 'folder') {
          throw new Error('Parent is not a folder');
        }
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
    }
    /* END of asynchronous checking operation   */
    /*  create fileSchema from model   */
    let fileModelInstance;
    try {
      fileModelInstance = new FileModel({ ...req.body, userId, parentId });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    /*  Save data locally */
    let localPath;
    if (type !== 'folder' && parentId === 0) {
      localPath = localStorage(req.body.data);
    }

    /* -save to databas */
    const newfile = await fileModelInstance.addOneToDatabase(localPath);
    const { _id } = newfile;
    delete newfile._id;
    return res.status(201).json({ ...newfile, id: _id });
  }

  static async getShow(req, res) {
    /* hecking Authentication (to be replaces with middleware afterwards) */
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    /* End checking authentiction */
    const user = await DBClient.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const file = await DBClient.getFile(id, userId);
    if (!file) {
      return res.status(404).json('Not found');
    }
    return res.status(201).json(file);
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
      return res.status(401).json({ error: 'Unauthorized' });
    }
    /* End checking authentiction */
    const user = await DBClient.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    /*  get all files for the authenticated user  */
    const allFiles = await DBClient.getAllFilesBasedParentId(userId, parentId);

    if (await allFiles.count() === 0) {
      return res.status(201).json([]);
    }

    return paginateResults(allFiles, page, res);
  }
}

export default FilesController;
