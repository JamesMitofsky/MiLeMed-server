import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.DATABASE_URL || 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'milemed',
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  // weird solution for deployment to Heroku from: https://stackoverflow.com/a/73370183/5395435
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Necessary for Heroku
  entities: ['src/entity/*.*'],
});
