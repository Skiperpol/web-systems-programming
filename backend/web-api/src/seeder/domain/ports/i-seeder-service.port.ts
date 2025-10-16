import { SeederResultModel } from '../model/seeder-result.model';
import { DatabaseStatsModel } from '../model/database-stats.model';

export interface ISeederServicePort {
  seedDatabase(): Promise<SeederResultModel>;
  clearDatabase(): Promise<void>;
  getDatabaseStats(): Promise<DatabaseStatsModel>;
}
