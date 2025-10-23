// data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity.js';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity.js';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity.js';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity.js';
import { join } from 'path';
import fs from 'fs';

config(); // wczytuje .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'web_systems_db',
  entities: [
    ProductTypeOrmEntity,
    WarehouseTypeOrmEntity,
    DiscountTypeOrmEntity,
    ClientTypeOrmEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: {
    ca: fs.readFileSync(join(__dirname, 'rds-ca-bundle.pem')),
  },
  logging: true,
});
