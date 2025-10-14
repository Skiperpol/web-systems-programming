import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { DiscountsModule } from './discounts/discounts.module';
import { ClientsModule } from './clients/clients.module';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ProductsModule,
    WarehousesModule,
    DiscountsModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
