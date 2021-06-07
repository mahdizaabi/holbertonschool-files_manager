import sha1 from 'sha1';
import DBClient from '../utils/db';
import Auth from '../utils/Auth';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    /**
   * Authenticate the user based on the BASE64 authentication System
   * Create a session-token for valid email/pass and return 201, 401 otherwise
   *
   * @param  {Object} request  - HTTP request object
   * @param  {Object} response - HTTP response object
   * @return {Object} http response
   */
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: 'Unauthorized' });

    if (!Auth.checkAuthorizationHeader(authorization)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { email, pass } = Auth.getAuthorizationHeader(authorization);
    if (!email || !pass) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await DBClient.getUserFromEmail(email);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.password !== sha1(pass) || !user.password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = Auth.generateID(user._id);
    return res.status(200).json(token);
  }

  static async getDisconnect(req, res) {
    const userRedisKey = `auth_${req.token}`;
    redisClient.del(userRedisKey);
    return res.status(204).end();
  }
}

export default AuthController;
