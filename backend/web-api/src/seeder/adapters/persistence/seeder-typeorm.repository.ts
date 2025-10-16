import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeederRepositoryPort } from '../../domain/ports/i-seeder-repository.port';
import { SeederResultModel } from '../../domain/model/seeder-result.model';
import { DatabaseStatsModel } from '../../domain/model/database-stats.model';
import { ClientTypeOrmEntity } from '../../../clients/adapters/persistence/client.entity';
import { ProductTypeOrmEntity } from '../../../products/adapters/persistence/product.entity';
import { WarehouseTypeOrmEntity } from '../../../warehouses/adapters/persistence/warehouse.entity';
import { DiscountTypeOrmEntity } from '../../../discounts/adapters/persistence/discount.entity';
import {
  CLIENTS_MOCK_DATA,
  PRODUCTS_MOCK_DATA,
  WAREHOUSES_MOCK_DATA,
  DISCOUNTS_MOCK_DATA,
} from '../../data/mocks';

@Injectable()
export class SeederTypeOrmRepository implements ISeederRepositoryPort {
  constructor(
    @InjectRepository(ClientTypeOrmEntity)
    private readonly clientRepository: Repository<ClientTypeOrmEntity>,
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepository: Repository<ProductTypeOrmEntity>,
    @InjectRepository(WarehouseTypeOrmEntity)
    private readonly warehouseRepository: Repository<WarehouseTypeOrmEntity>,
    @InjectRepository(DiscountTypeOrmEntity)
    private readonly discountRepository: Repository<DiscountTypeOrmEntity>,
  ) {}

  async clearAllData(): Promise<void> {
    await this.discountRepository.clear();
    await this.productRepository.clear();
    await this.warehouseRepository.clear();
    await this.clientRepository.clear();
  }

  async seedClients(): Promise<number> {
    const clients = CLIENTS_MOCK_DATA.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
    }));

    await this.clientRepository.save(clients);
    return clients.length;
  }

  async seedProducts(): Promise<number> {
    const products = PRODUCTS_MOCK_DATA.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    }));

    await this.productRepository.save(products);
    return products.length;
  }

  async seedWarehouses(): Promise<number> {
    const warehouses = WAREHOUSES_MOCK_DATA.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      capacity: warehouse.capacity,
    }));

    await this.warehouseRepository.save(warehouses);
    return warehouses.length;
  }

  async seedDiscounts(): Promise<number> {
    const discounts = DISCOUNTS_MOCK_DATA.map((discount) => ({
      id: discount.id,
      name: discount.name,
      percentage: discount.percentage,
      description: discount.description,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
    }));

    await this.discountRepository.save(discounts);
    return discounts.length;
  }

  async getDatabaseStats(): Promise<DatabaseStatsModel> {
    const [clients, products, warehouses, discounts] = await Promise.all([
      this.clientRepository.count(),
      this.productRepository.count(),
      this.warehouseRepository.count(),
      this.discountRepository.count(),
    ]);

    return new DatabaseStatsModel(clients, products, warehouses, discounts);
  }

  async seedAll(): Promise<SeederResultModel> {
    await this.clearAllData();

    const [clients, products, warehouses, discounts] = await Promise.all([
      this.seedClients(),
      this.seedProducts(),
      this.seedWarehouses(),
      this.seedDiscounts(),
    ]);

    return new SeederResultModel(clients, products, warehouses, discounts);
  }
}
