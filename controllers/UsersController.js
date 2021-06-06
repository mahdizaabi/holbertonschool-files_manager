import sha1 from 'sha1';
import DBClient from '../utils/db';
import Auth from '../utils/Auth';

class UsersController {
  static async postNew(req, res) {
    /**
   * parse password and email from the request object and check if the email is already on the db
   * create a new User and return 201, 400 otherwise.
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const user = await DBClient.checkEmail(email);
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const ops = await DBClient.setNewUser({ email, password: hashedPassword });
    return res.status(201).json({ id: ops.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const userId = await Auth.getUserByToken(token);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { _id, email } = await DBClient.getUserById(userId);
    return res.status(200).json({ _id, email });
  }
}
export default UsersController;
