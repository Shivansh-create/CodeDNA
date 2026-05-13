import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisUrl = process.env.REDIS_URL;
if (redisUrl && redisUrl.startsWith('redis://') && redisUrl.includes('upstash.io')) {
    console.log('Detected Upstash URL, trying rediss://');
    redisUrl = redisUrl.replace('redis://', 'rediss://');
}

console.log('Testing connection to:', redisUrl?.split('@')[1] || 'localhost');

const redis = new Redis(redisUrl || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
  // TLS is automatically handled if URL starts with rediss://
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err) => {
    console.error('Redis error:', err);
});

async function test() {
  try {
    const res = await redis.ping();
    console.log('Ping result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
