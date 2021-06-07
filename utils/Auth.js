import { v4 as uuidv4 } from 'uuid';
import redisClient from './redis';

class Auth {
  static checkAuthorizationHeader(authHeader) {
    return (authHeader.slice(0, 6) === 'Basic ');
  }

  static getAuthorizationHeader(authorization) {
    const decryptedAuth = Buffer.from(authorization.slice(6), 'base64').toString('utf-8');
    const email = decryptedAuth.split(':')[0];
    const pass = decryptedAuth.split(':')[1];
    return ({ email, pass });
  }

  static generateID(userId) {
    const token = uuidv4();
    redisClient.set(`auth_${token}`, userId.toString(), 86400);
    return ({ token });
  }

  static async getUserByToken(token) {
    const userRedisKey = `auth_${token}`;
    try {
      const userId = await redisClient.get(userRedisKey);
      return (userId);
    } catch (e) {
      return e;
    }
  }
}

export default Auth;
