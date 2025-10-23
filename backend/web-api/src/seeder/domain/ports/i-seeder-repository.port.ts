import { SeederResultModel } from '../model/seeder-result.model.js';
import { DatabaseStatsModel } from '../model/database-stats.model.js';

export interface ISeederRepositoryPort {
  clearAllData(): Promise<void>;
  seedClients(): Promise<number>;
  seedProducts(): Promise<number>;
  seedWarehouses(): Promise<number>;
  seedDiscounts(): Promise<number>;
  getDatabaseStats(): Promise<DatabaseStatsModel>;
  seedAll(): Promise<SeederResultModel>;
}
