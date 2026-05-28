import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let redisClient: RedisClientType | null = null;
let isRedisConnected = false;

// In-Memory cache fallback structure
const memoryCache = new Map<string, { value: string; expiry: number | null }>();

const initializeRedis = async () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  if (process.env.USE_REDIS_FALLBACK === 'false') {
    logger.info('Redis fallback disabled. Attempting to connect to Redis...');
  }

  try {
    const client = createClient({ url: redisUrl });

    client.on('error', (err) => {
      logger.warn(`Redis Client Error: ${err.message}`);
      isRedisConnected = false;
    });

    client.on('connect', () => {
      logger.info('Connecting to Redis server...');
    });

    client.on('ready', () => {
      logger.info('Redis client connected and ready.');
      isRedisConnected = true;
    });

    await client.connect();
    redisClient = client as RedisClientType;
  } catch (error) {
    logger.warn(`Could not connect to Redis server: ${(error as Error).message}. Falling back to in-memory cache.`);
    isRedisConnected = false;
    redisClient = null;
  }
};

// Gracefully handle cache operations
export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.get(key);
      } catch (err) {
        logger.warn(`Redis get error for key ${key}: ${(err as Error).message}`);
      }
    }
    
    // In-memory fallback
    const entry = memoryCache.get(key);
    if (!entry) return null;
    
    if (entry.expiry && entry.expiry < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  },

  set: async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, value, { EX: ttlSeconds });
        } else {
          await redisClient.set(key, value);
        }
        return;
      } catch (err) {
        logger.warn(`Redis set error for key ${key}: ${(err as Error).message}`);
      }
    }

    // In-memory fallback
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    memoryCache.set(key, { value, expiry });
  },

  del: async (key: string): Promise<void> => {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (err) {
        logger.warn(`Redis del error for key ${key}: ${(err as Error).message}`);
      }
    }

    // In-memory fallback
    memoryCache.delete(key);
  },

  isUsingRedis: (): boolean => {
    return isRedisConnected;
  }
};

// Start initialization
initializeRedis();

export { redisClient };
