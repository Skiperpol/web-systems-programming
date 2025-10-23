import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity.js';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity.js';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity.js';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity.js';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_DATABASE', 'web_systems_db'),
    entities: [
      ProductTypeOrmEntity,
      WarehouseTypeOrmEntity,
      DiscountTypeOrmEntity,
      ClientTypeOrmEntity,
    ],
    autoLoadEntities: true,
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    logger: 'advanced-console',
  };
};
