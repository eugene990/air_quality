import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

import { AirQualityEntity } from './entities/air-quality.entity';

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT} = process.env;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  database:DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  synchronize: false,
  logging: true,
  migrations: [`src/migrations/*.ts`],
  entities: [ AirQualityEntity ],
});

export default AppDataSource;
