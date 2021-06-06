import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AppController {
  static getStatus(req, res) {
    res.status(200).send(JSON.stringify({ redis: RedisClient.isAlive(), db: DBClient.isAlive() }));
  }

  static async getStats(req, res) {
    const nbUser = await DBClient.nbUsers();
    const nbFiles = await DBClient.nbUsers();

    res.status(200).send({ users: nbUser, files: nbFiles });
  }
}

export default AppController;
