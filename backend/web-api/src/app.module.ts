import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { DiscountsModule } from './discounts/discounts.module';
import { ClientsModule } from './clients/clients.module';
import { SeederModule } from './seeder/seeder.module';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '../../../../.env.local'),
        join(__dirname, '../../../../.env.development'),
        join(__dirname, '../../../../.env'),
        join(__dirname, '../../../../env.example'),
      ],
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
