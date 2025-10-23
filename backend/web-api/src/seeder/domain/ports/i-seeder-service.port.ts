import { SeederResultModel } from '../model/seeder-result.model.js';
import { DatabaseStatsModel } from '../model/database-stats.model.js';

export interface ISeederServicePort {
  seedDatabase(): Promise<SeederResultModel>;
  clearDatabase(): Promise<void>;
  getDatabaseStats(): Promise<DatabaseStatsModel>;
}
