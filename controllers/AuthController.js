import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import hashPswd from '../utils/passEncryption';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;

    if (!Auth.checkAuthorizationHeader(authorization)) {
      return res.status(401).body({ error: 'Unauthorized' });
    }
    const { email, pass } = Auth.getAuthorizationHeader(authorization);
    if (!email || !pass) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const { password, _id } = await DBClient.getUserFromEmail(email);
    if (password.toString('hex') !== hashPswd(pass).toString('hex') || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = Auth.generateID(_id);
    return res.status(200).json(token);
  }

  static async disconnect(req, res) {
    const token = req.headers['x-token'];
    const userRedisKey = `auth_${token}`;
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    redisClient.del(userRedisKey);
    return res.status(201).end();
  }
}

export default AuthController;
