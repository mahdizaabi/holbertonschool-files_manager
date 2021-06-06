import sha1 from 'sha1';
import DBClient from '../utils/db';
import Auth from '../utils/Auth';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
      return;
    }
    try {
      const checkedEmail = await DBClient.checkEmail(email);
      if (checkedEmail) {
        res.status(400).send({ error: 'Already exist' });
        return;
      }
    } catch (e) {
      res.status(400).send({ error: 'Already exist' });
    }

    try {
      const ops = await DBClient.setNewUser({ email, password: sha1(password) });
      res.status(201).send(JSON.stringify({ id: ops.insertedId, email }));
      return;
    } catch (err) {
      res.status(500).send({ error: 'internal Error' });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);

    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const { _id, email } = await DBClient.getUserById(userId);
    res.status(200).send({ _id, email });
  }
}
export default UsersController;
