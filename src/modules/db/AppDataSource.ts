import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'milemed',
  synchronize: true,
  logging: true,
  entities: ['src/entity/*.*'],
});
