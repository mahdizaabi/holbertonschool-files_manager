import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import FileModel from '../models/fileModel';
import localStorage from '../utils/localStorage';

class FilesController {
  static async postUpload(req, res) {
    /* hecking Authentication */
    const { type } = req.body;
    console.log(req.body)
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
    if (type !== 'folder') {
      localPath = localStorage(req.body.data);
    }

    /* -save to database */
    const newfile = await fileModelInstance.addOneToDatabase(localPath);
    res.status(201).send(JSON.stringify(newfile));
  }
}

export default FilesController;
