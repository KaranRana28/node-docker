import { redisInfo } from '../config.js';
import { Redis } from 'ioredis';
import Logger from '../core/Logger.js';

const client = getRedisConnection();

client.on('connect', () => Logger.info('Redis is connecting'));
client.on('ready', () => Logger.info('Redis is ready'));
client.on('end', () => Logger.info('Redis disconnected'));
client.on('reconnecting', () => Logger.info('Redis is reconnecting'));
// client.on('error', (e) => Logger.error(e));
client.on('error', (e) => {
  Logger.error("Redis error: " + e);
  client.disconnect();
});

function getRedisConnection() {
  return new Redis({
    host: redisInfo.host,
    port: redisInfo.port,
    password: redisInfo.password,
    db: redisInfo.db
  });
}


// If the Node process ends, close the Redis connection
process.on('SIGINT', async () => {
  Logger.info('Closing Redis connection');
  client.disconnect();
});

export default client;