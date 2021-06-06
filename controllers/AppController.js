import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AppController {
  static getStatus(req, res) {
    res.status(200).send({ redis: RedisClient.isAlive, db: DBClient.isAlive });
  }

  static async getStats(req, res) {
    res.status(200).send({ users: `${await DBClient.nbUsers()}`, files: `${await DBClient.nbFiles()}` });
  }
}

export default AppController;
