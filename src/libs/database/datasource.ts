import { DataSource, DataSourceOptions } from 'typeorm';
import { migrations } from './migrations';

const config: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST_WRITE,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations,
  entities: ['src/**/*.entity.ts'],
};
export const dataSource = new DataSource(config);
