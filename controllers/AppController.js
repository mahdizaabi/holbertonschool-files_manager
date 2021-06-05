import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AppController {
  static getStatus(req, res) {
    if (DBClient.isAlive && RedisClient) {
      res.status(200).send({ redis: true, db: true });
    }
  }

  static async getStats(req, res) {
    res.status(200).send({ users: `${await DBClient.nbUsers()}`, files: `${await DBClient.nbFiles()}` });
  }
}

export default AppController;
