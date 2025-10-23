import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductsModule } from './products/products.module.js';
import { WarehousesModule } from './warehouses/warehouses.module.js';
import { DiscountsModule } from './discounts/discounts.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { SeederModule } from './seeder/seeder.module.js';
import { databaseConfig } from './database/database.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    ProductsModule,
    WarehousesModule,
    DiscountsModule,
    ClientsModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
