import sha1 from 'sha1';
import DBClient from '../utils/db';
import Auth from '../utils/Auth';

class UsersController {
  /**
   * Check the request body for user's 'email' and 'password'. If user already exists
   * should response with 400, otherwise create a new user in the DB using 'dbClient'.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    const checkedEmail = await DBClient.checkEmail(email);
    if (checkedEmail) {
      return res.status(400).send({ error: 'Already exist' });
    }

    try {
      const hashedPassword = sha1(password);
      const ops = await DBClient.setNewUser({ email, password: hashedPassword });
      return res.status(201).send(JSON.stringify({ id: ops.insertedId, email }));
    } catch (err) {
      return res.status(500).send({ error: 'internal Error' });
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
