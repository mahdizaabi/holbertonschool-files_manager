import redis from 'redis';

const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.get = promisify(this.client.get).bind(this.client);
    this.client.on('error', (error) => {
      console.log(error);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) { return this.client.get(key); }

  async set(key, value, expiration) {
    this.client.set(key, value);
    this.client.expire(key, expiration);
  }

  async del(key) {
    this.client.del(key);
  }
}
const redisClient = new RedisClient();

export default redisClient;
