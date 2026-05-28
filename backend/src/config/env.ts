import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config();

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'codelearn',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  USE_REDIS_FALLBACK: process.env.USE_REDIS_FALLBACK !== 'false',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_token_1234567890',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_token_1234567890',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Judge0
  JUDGE0_API_URL: process.env.JUDGE0_API_URL || 'http://localhost:2358',
  JUDGE0_RAPIDAPI_KEY: process.env.JUDGE0_RAPIDAPI_KEY || '',
  JUDGE0_RAPIDAPI_HOST: process.env.JUDGE0_RAPIDAPI_HOST || '',

  // Claude AI
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
};
