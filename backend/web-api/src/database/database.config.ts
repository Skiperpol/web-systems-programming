import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'web_systems_db',
  entities: [
    ProductTypeOrmEntity,
    WarehouseTypeOrmEntity,
    DiscountTypeOrmEntity,
    ClientTypeOrmEntity,
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Automatycznie tworzy tabele w trybie development
  logging: process.env.NODE_ENV === 'development',
};
