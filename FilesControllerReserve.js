import DBClient from '../utils/db';
import hashPswd from '../utils/passEncryption';
import Auth from '../utils/Auth';

class FilesController {
    static postUpload(req, res) {
        /* hecking Authentication */
        const acceptedType = ['file', 'folde', 'image'];

        const token = req.headers['x-token'];
        const userRedisKey = `auth_${token}`;
        const userId = await Auth.getUserByToken(token);
        if (!userId) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        /* End checking authentiction */

        const user = DBClient.getUserById(userId)

        if (user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const { name, type, parentId, isPublic, data } = req.body;

        if (!name || !type || !acceptedType.includes(type) || !data && type !== 'folder') {
            if (!name) {
                res.status(400).send({ error: 'Missing name' });
            }
            else if (!type || !acceptedType.includes(type)) {
                res.status(400).send({ error: 'Missing type' });
            }
            else {
                res.status(400).send({ error: 'Missing data' });
            }
            return;
        }

        if(parentId) {
            const file = await DBClient.getparentIdFile(parentId);
            if(!file) {
                res.status(400).send({ error: 'Parent not found' });
                return;
            }
            if(file.type !== "folder") {
                res.status(400).send({ error: 'Parent is not a folder' });
                return;
            }
        }
        
    }
}