import DBClient from '../utils/db';
import hashPswd from '../utils/passEncryption';
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

    const checkedEmail = await DBClient.checkEmail(email);
    if (checkedEmail) {
      res.status(400).send({ error: 'Already exist' });
      return;
    }
    const { ops } = await DBClient.setNewUser({ email, password: hashPswd(password) });
    const { _id } = ops[0];
    res.status(201).send(JSON.stringify({ id: _id, email }));
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
