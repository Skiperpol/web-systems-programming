import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
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
  synchronize:
    configService.get<string>('NODE_ENV', 'development') !== 'production',
  logging:
    configService.get<string>('NODE_ENV', 'development') === 'development',
});
