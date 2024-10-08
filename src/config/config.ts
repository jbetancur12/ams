import dotenv from 'dotenv';

dotenv.config();

export const config = {
  APP_ENV: process.env.APP_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dbname',
};
