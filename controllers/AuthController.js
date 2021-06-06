import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import hashPswd from '../utils/passEncryption';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;

    if (!Auth.checkAuthorizationHeader(authorization)) {
      res.status(401).body({ error: 'Unauthorized' });
      return;
    }
    const { email, pass } = Auth.getAuthorizationHeader(authorization);
    if (!email || !pass) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const { password, _id } = await DBClient.getUserFromEmail(email);
    if (password.toString('hex') !== hashPswd(pass).toString('hex') || !password) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const token = Auth.generateID(_id);
      res.status(200).send(token);
    }
  }

  static async disconnect(req, res) {
    const token = req.headers['x-token'];
    const userRedisKey = `auth_${token}`;
    const userId = await Auth.getUserByToken(token);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    redisClient.del(userRedisKey);
    res.status(201).end();
  }
}

export default AuthController;
